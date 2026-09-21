-- O raio-x do site que a IA da conversa preenche no `ia gravar` (lib/ia.mjs): tipo, serviços, público,
-- profissionais, unidades, porte, do_nicho e o motivo. `resumo_site` e `porte_estimado` são o resumo dele.
ALTER TABLE prospeccao.leads ADD COLUMN IF NOT EXISTS raio_x_site JSONB;
