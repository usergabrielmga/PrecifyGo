const pool = require('../config/database');

const ClienteModel = require('../models/cliente.model');
const OrcamentoModel = require('../models/orcamento.model');
const ItemModel = require('../models/item.model');
const EmissorModel = require('../models/emissor.model');

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Escapa valores antes de inserir no HTML.
function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

class OrcamentoService {

  // ================= CRIAR ORÇAMENTO =================

  static async create(data, usuarioId) {

    if (!data) {
      throw new Error('Body vazio');
    }

    if (!usuarioId) {
      throw new Error('Usuário não identificado');
    }

    if (!Array.isArray(data.itens) || data.itens.length === 0) {
      throw new Error('Orçamento precisa ter ao menos um item');
    }

    const client = await pool.connect();

    try {

      await client.query('BEGIN');

      // ================= EMISSOR =================

      const emissorData = {
        nome: data.nome,
        cpf_cnpj: data.cpfCnpj,
        endereco: data.endereco ?? null,
        telefone: data.telefone ?? null,
        email: data.email ?? null,
        logotipo: data.logo ?? null
      };

      const emissorId = await EmissorModel.create(
        emissorData,
        usuarioId,
        client
      );

      // ================= CLIENTE =================

      const clienteData = {
        nome: data.nomeClient?.trim(),

        cpf_cnpj: data.cpfCnpjClient
          ? String(data.cpfCnpjClient).replace(/\D/g, '')
          : null,

        endereco: data.enderecoClient?.trim() ?? null,
        telefone: data.telefoneClient?.trim() ?? null,
        email: data.emailClient?.trim() ?? null
      };

      let clienteId = await ClienteModel.findByCpfCnpj(
        clienteData.cpf_cnpj,
        client,
        usuarioId
      );

      if (!clienteId) {
        clienteId = await ClienteModel.create(
          clienteData,
          client,
          usuarioId
        );
      }

      console.log('Cliente ID final:', clienteId);

      // ================= TOKEN PÚBLICO =================

      const tokenPublico = crypto.randomBytes(32).toString('hex');

      // ================= DADOS DO ORÇAMENTO =================

      const orcamentoData = {
        formaPagamento: data.formaPagamento ?? null,
        motivoDesconto: data.motivoDesconto ?? null,
        desconto: Number(data.desconto) || 0,
        motivoAcrescimo: data.motivoAcrescimo ?? null,
        acrescimo: Number(data.acrescimo) || 0,
        dataValidade: data.dataValidade ?? null,
        observacoes: data.observacoes ?? null,
        Emissor_Id_emissor: emissorId,
        Cliente_Id_cliente: clienteId,
        tokenPublico
      };

      const numeroOrcamento = await OrcamentoModel.create(
        orcamentoData,
        client,
        usuarioId
      );

      console.log('Número do orçamento:', numeroOrcamento);

      // ================= ITENS DO ORÇAMENTO =================

      for (const item of data.itens) {

        await ItemModel.create(
          numeroOrcamento,
          {
            produto_id: item.produtoId ?? null,
            servico_id: item.servicoId ?? null,
            quantidade: Number(item.quantidade) || 1,
            valor_unitario: Number(item.valorUnitario) || 0
          },
          client
        );

      }

      await client.query('COMMIT');

      return {
        clienteId,
        emissorId,
        numero_orcamento: numeroOrcamento,
        tokenPublico
      };

    } catch (error) {

      await client.query('ROLLBACK');

      console.error('Erro ao criar orçamento:', error);

      throw error;

    } finally {

      client.release();

    }

  }

  // ================= LISTAR ORÇAMENTOS =================

  static async getAll(usuarioId) {

    const client = await pool.connect();

    try {

      return await OrcamentoModel.findAllForModal(
        client,
        usuarioId
      );

    } finally {

      client.release();

    }

  }

  // ================= BUSCAR ORÇAMENTO POR ID =================

  static async getById(id) {

    const client = await pool.connect();

    try {

      const data = await OrcamentoModel.findCompleteById(
        id,
        client
      );

      if (!data) {
        throw new Error('Orçamento não encontrado');
      }

      return data;

    } finally {

      client.release();

    }

  }

  // ================= ATUALIZAR STATUS E ESTOQUE =================

  static async updateStatus(numeroOrcamento, novoStatus, usuarioId) {

    const client = await pool.connect();

    try {

      await client.query('BEGIN');

      const statusPermitidos = [
        'Pendente',
        'Aprovado',
        'Recusado',
        'Cancelado'
      ];

      if (!statusPermitidos.includes(novoStatus)) {
        throw new Error('Status inválido');
      }

      // Bloqueia o orçamento durante a operação.
      // Isso evita duas aprovações simultâneas.

      const budgetResult = await client.query(
        `
        SELECT numero_orcamento, status
        FROM dados_orcamento
        WHERE numero_orcamento = $1
          AND usuario_id = $2
        FOR UPDATE
        `,
        [numeroOrcamento, usuarioId]
      );

      if (budgetResult.rows.length === 0) {
        throw new Error('Orçamento não encontrado');
      }

      const statusAtual = budgetResult.rows[0].status;

      // Se já estiver no mesmo status, não faz nada.

      if (statusAtual === novoStatus) {

        await client.query('COMMIT');

        return {
          status: statusAtual,
          message: 'O orçamento já está com esse status.'
        };

      }

      // Não permite retirar a aprovação sem devolver o estoque.

      if (statusAtual === 'Aprovado' && novoStatus !== 'Aprovado') {

        throw new Error(
          'Não é possível alterar o status de um orçamento aprovado sem antes devolver os produtos ao estoque.'
        );

      }

      // ================= BAIXA DE ESTOQUE =================

      if (novoStatus === 'Aprovado') {

        // Busca somente os produtos.
        // Serviços não possuem movimentação de estoque.

        const produtosResult = await client.query(
          `
          SELECT
            i.produto_id,
            i.quantidade,
            p.nome,
            p.estoque
          FROM itens_orcamento i
          INNER JOIN produtos p
            ON p.id_produto = i.produto_id
          WHERE i.dados_orcamento_numero_orcamento = $1
            AND i.produto_id IS NOT NULL
            AND p.usuario_id = $2
          FOR UPDATE OF p
          `,
          [numeroOrcamento, usuarioId]
        );

        for (const item of produtosResult.rows) {

          const quantidade = Number(item.quantidade);
          const estoqueAtual = Number(item.estoque);

          if (!Number.isInteger(quantidade) || quantidade <= 0) {

            throw new Error(
              `Quantidade inválida para o produto ${item.nome}.`
            );

          }

          if (estoqueAtual < quantidade) {

            throw new Error(
              `Estoque insuficiente para o produto "${item.nome}". Disponível: ${estoqueAtual}. Necessário: ${quantidade}.`
            );

          }

          // Retira a quantidade do estoque.

          const updateEstoque = await client.query(
            `
            UPDATE produtos
            SET estoque = estoque - $1
            WHERE id_produto = $2
              AND usuario_id = $3
              AND estoque >= $1
            RETURNING estoque
            `,
            [quantidade, item.produto_id, usuarioId]
          );

          if (updateEstoque.rows.length === 0) {

            throw new Error(
              `Não foi possível atualizar o estoque do produto ${item.nome}.`
            );

          }

          // Registra a saída no histórico.

          await client.query(
            `
            INSERT INTO movimentacoes_estoque (
              produto_id,
              tipo,
              quantidade,
              observacao,
              usuario_id
            )
            VALUES ($1, 'SAIDA', $2, $3, $4)
            `,
            [
              item.produto_id,
              quantidade,
              `Baixa automática pelo orçamento #${numeroOrcamento}`,
              usuarioId
            ]
          );

        }

      }

      // ================= ATUALIZAR STATUS =================

      await client.query(
        `
        UPDATE dados_orcamento
        SET status = $1,
            data_resposta = NOW()
        WHERE numero_orcamento = $2
          AND usuario_id = $3
        `,
        [novoStatus, numeroOrcamento, usuarioId]
      );

      await client.query('COMMIT');

      return {
        status: novoStatus,
        message: novoStatus === 'Aprovado'
          ? 'Orçamento aprovado e estoque atualizado com sucesso.'
          : 'Status do orçamento atualizado com sucesso.'
      };

    } catch (error) {

      await client.query('ROLLBACK');

      throw error;

    } finally {

      client.release();

    }

  }

  // ================= EXCLUIR ORÇAMENTO =================

  static async delete(numeroOrcamento, usuarioId) {

    const client = await pool.connect();

    try {

      await client.query('BEGIN');

      const budget = await client.query(
        `
        SELECT status
        FROM dados_orcamento
        WHERE numero_orcamento = $1
          AND usuario_id = $2
        FOR UPDATE
        `,
        [numeroOrcamento, usuarioId]
      );

      if (budget.rows.length === 0) {
        throw new Error('Orçamento não encontrado');
      }

      if (budget.rows[0].status === 'Aprovado') {

        throw new Error(
          'Não é possível excluir um orçamento aprovado sem antes devolver os produtos ao estoque.'
        );

      }

      await client.query(
        `
        DELETE FROM itens_orcamento
        WHERE dados_orcamento_numero_orcamento = $1
        `,
        [numeroOrcamento]
      );

      await client.query(
        `
        DELETE FROM dados_orcamento
        WHERE numero_orcamento = $1
          AND usuario_id = $2
        `,
        [numeroOrcamento, usuarioId]
      );

      await client.query('COMMIT');

    } catch (error) {

      await client.query('ROLLBACK');

      throw error;

    } finally {

      client.release();

    }

  }

  // ================= GERAR PDF =================

  static async generatePdf(id) {

    const { budget, items, total } = await this.getById(id);

    const templatePath = path.resolve(
      __dirname,
      '../../templates/orcamento.html'
    );

    console.log('Caminho do template:', templatePath);
    console.log('Template existe?', fs.existsSync(templatePath));

    if (!fs.existsSync(templatePath)) {
      throw new Error(
        `Template não encontrado: ${templatePath}`
      );
    }

    let html = fs.readFileSync(templatePath, 'utf-8');

    // ================= ITENS DO PDF =================

    const itemsHtml = items.map((item) => {

      const unit = Number(item.valor_unitario);
      const totalItem = Number(item.total_item);

      return `
        <tr>
          <td>${escapeHtml(item.produto_servico)}</td>
          <td>${escapeHtml(item.quantidade)}</td>
          <td>R$ ${unit.toFixed(2)}</td>
          <td>R$ ${totalItem.toFixed(2)}</td>
        </tr>
      `;

    }).join('');

    // ================= LOGO DO EMISSOR =================

    const logoUrl = String(budget.emissor_logo || '').trim();

    let logoHtml = '';

    if (logoUrl) {

      const logoSegura = escapeHtml(logoUrl);

      logoHtml = `
        <img
          class="issuer-logo"
          src="${logoSegura}"
          alt="Logo do emissor"
        >
      `;

    }

    // ================= SUBSTITUIR DADOS NO HTML =================

    html = html
      .replace('{{logo}}', logoHtml)
      .replace('{{numero_orcamento}}', escapeHtml(budget.numero_orcamento))
      .replace('{{emissor_nome}}', escapeHtml(budget.emissor_nome))
      .replace('{{emissor_email}}', escapeHtml(budget.emissor_email))
      .replace('{{emissor_telefone}}', escapeHtml(budget.emissor_telefone))
      .replace('{{cliente_nome}}', escapeHtml(budget.cliente_nome))
      .replace('{{cliente_email}}', escapeHtml(budget.cliente_email))
      .replace('{{cliente_telefone}}', escapeHtml(budget.cliente_telefone))
      .replace('{{items}}', itemsHtml)
      .replace('{{total}}', Number(total || 0).toFixed(2));

    // ================= INICIAR CHROMIUM =================

    let browser;

    try {

      console.log('===== INICIANDO CHROMIUM NA VERCEL =====');

      const [chromiumModule, puppeteerModule] = await Promise.all([
        import('@sparticuz/chromium'),
        import('puppeteer-core')
      ]);

      const chromium = chromiumModule.default;
      const puppeteer = puppeteerModule.default;

      const executablePath = await chromium.executablePath();

      console.log('Executável Chromium:', executablePath);

      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath,
        headless: chromium.headless
      });

      const page = await browser.newPage();

      // Carrega o HTML do orçamento.

      await page.setContent(html, {
        waitUntil: 'networkidle0'
      });

      // Aguarda o carregamento das imagens, incluindo a logo.

      await page.evaluate(async () => {

        await Promise.all(
          Array.from(document.images).map((img) => {

            if (img.complete) {
              return Promise.resolve();
            }

            return new Promise((resolve) => {

              img.onload = resolve;
              img.onerror = resolve;

            });

          })
        );

      });

      // ================= GERAR PDF =================

      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true
      });

      return pdf;

    } catch (error) {

      console.error('Erro ao gerar PDF:', error);

      throw error;

    } finally {

      if (browser) {
        await browser.close();
      }

    }

  }

}

module.exports = OrcamentoService;