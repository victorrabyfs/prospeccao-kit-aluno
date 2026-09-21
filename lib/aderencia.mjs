// A busca por texto do Maps traz vizinho de tema junto: loja de material de construção,
// escola que dá curso do assunto, condomínio que instalou. Score alto no nicho errado é
// pior que score baixo — aqui é onde eles são separados.

const semAcento = (s) => String(s ?? '')
  .normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/**
 * Três respostas, não duas:
 *   'sim'        — o texto confirma o nicho
 *   'nao'        — o texto diz que a empresa é outra coisa
 *   'indefinido' — não deu pra saber (site morto, sem resumo): fica pro olho humano
 *
 * `confirma` tem precedência sobre `descarta` de propósito. A palavra "condomínio" no
 * resumo de uma integradora é o CLIENTE dela ("instala para residências e condomínios"),
 * não a identidade — quem manda é o que a empresa faz, não quem ela atende.
 */
export function aderente(lead, regras) {
  if (!regras) return { veredito: 'sim', motivo: 'nicho sem regra de aderência' };

  const temResumo = Boolean(lead.resumo_site);
  const fonte = temResumo
    ? { texto: lead.resumo_site, origem: 'resumo do site' }
    : { texto: `${lead.nome ?? ''} ${lead.categoria ?? ''}`, origem: 'nome/categoria do Maps' };
  const texto = semAcento(fonte.texto);

  // Identidade inequívoca: quem "forma profissionais em energia solar" é escola, não integradora,
  // e nenhuma menção ao nicho muda isso. Por isso vence até o `confirma`.
  // Só expressão fechada entra aqui — a palavra "curso" sozinha derrubaria a integradora que
  // instala E dá curso, que é lead legítimo.
  const forte = (regras.descarta_forte ?? []).find((t) => texto.includes(semAcento(t)));
  if (forte) return { veredito: 'nao', motivo: `é outro ramo: "${forte}" no ${fonte.origem}` };

  // O raio-x da IA já respondeu se a empresa É o cliente do nicho, lendo o site inteiro. A palavra do
  // ramo no resumo não prova isso: "radiologia odontológica" atende dentista, não paciente.
  const raioX = lead.raio_x_site;
  if (temResumo && raioX?.do_nicho === false) return { veredito: 'nao', motivo: `a leitura do site diz que não é do nicho: ${raioX.motivo ?? raioX.tipo ?? ''}`.trim() };
  if (temResumo && raioX?.do_nicho === true) return { veredito: 'sim', motivo: `a leitura do site confirma: ${raioX.motivo ?? ''}`.trim() };

  const confirma = (regras.confirma ?? []).find((t) => texto.includes(semAcento(t)));
  if (confirma) return { veredito: 'sim', motivo: `"${confirma}" no ${fonte.origem}` };

  const descarta = (regras.descarta ?? []).find((t) => texto.includes(semAcento(t)));
  if (descarta) return { veredito: 'nao', motivo: `é outro ramo: "${descarta}" no ${fonte.origem}` };

  // A IA leu o site inteiro e não falou do nicho: é resposta, não dúvida.
  if (temResumo) return { veredito: 'nao', motivo: 'o site não fala do nicho' };

  // Sem site vivo, o nome sozinho não decide. Não descarto um lead por falta de prova.
  return { veredito: 'indefinido', motivo: 'sem site pra confirmar; só o nome não decide' };
}
