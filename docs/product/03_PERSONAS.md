# Personas e Usuarios - ARDEN FVS

## Visao Geral

| Persona | Acesso Web | Acesso Mobile | Funcao Principal |
|---------|------------|---------------|------------------|
| Admin | Completo | Nao | Configurar e gerenciar |
| Engenheiro | Obras dele | Sim | Verificar e analisar |
| Inspetor | Nao | Sim | Verificar em campo |
| Almoxarife | Simplificado | Nao | Liberar materiais |
| Super Admin | Interno | Nao | Suporte Arden |

---

## Administrador

### Perfil
Gerente de qualidade, engenheiro chefe ou dono da construtora.

### Responsabilidades
- Criar e configurar obras
- Gerenciar biblioteca de servicos (FVS)
- Cadastrar e gerenciar usuarios
- Configurar integracoes, alertas, automacoes
- Exportar relatorios de todas obras
- Gerenciar assinatura/plano

### Acesso
Portal Web completo (Visao Global + Obras Especificas). Nao usa app mobile.

### Frequencia
- Alta no inicio (configuracao)
- Media/baixa depois (manutencao)
- Diaria para dashboards/relatorios

### Permissoes Especiais
- Unico que pode deletar verificacoes (com justificativa)
- Ver todas obras da construtora
- Configuracoes globais

---

## Engenheiro

### Perfil
Engenheiro civil, responsavel tecnico pelas verificacoes em uma ou mais obras.

### Responsabilidades
- Fazer verificacoes (app mobile + portal web)
- Analisar indicadores e dashboards da obra
- Responder rapidamente a NCs
- Aprovar/reprovar verificacoes de inspetores (feature opcional)
- Liberar seletivamente quais inspecoes inspetores podem fazer (feature opcional)
- Exportar relatorios das obras dele

### Acesso
Portal Web (apenas obras atribuidas) + App Mobile completo.

### Contexto de Trabalho
Geralmente 1 engenheiro + 2 inspetores por obra.

### Frequencia
Diaria (inspecoes + analise de NCs). App mobile e principal interface.

### Permissoes
- Fazer verificacoes
- Ver dashboards/relatorios das obras dele
- NAO pode alterar configuracoes de obra
- NAO pode gerenciar usuarios
- NAO pode deletar verificacoes

---

## Inspetor

### Perfil
Estagiario de engenharia, auxiliar tecnico ou tecnico em edificacoes.

### Responsabilidades
- Fazer verificacoes em campo (app mobile apenas)
- Tirar fotos de NCs
- Registrar observacoes

### Acesso
**Apenas app mobile.** Nao acessa portal web.

Ve apenas inspecoes liberadas pelo engenheiro (se feature ativa) ou todas (se nao ativa).

### Frequencia
Diaria (aumenta proximo a auditorias).

### Permissoes
- Fazer verificacoes (mobile apenas)
- NAO ve dashboards
- NAO exporta relatorios

---

## Almoxarife

### Perfil
Profissional responsavel pelo almoxarifado da obra. Nao precisa conhecimento tecnico profundo.

### Responsabilidades
- Visualizar Condicoes de Inicio (CI) dos servicos
- Liberar ou negar materiais baseado no status de CI
- Registrar entregas de material
- Solicitar autorizacao manual do engenheiro quando necessario

### Acesso
Portal web **ultra simplificado** (apenas CI e liberacoes).

Dispositivo fixo no almoxarifado (computador/tablet).

### Frequencia
Diaria (sempre que ha solicitacao de material).

### Feature Opcional
Funcionalidade de CI e opcional. Construtoras com processos proprios podem desativar.

---

## Super Admin (Equipe Arden)

### Perfil
Equipe tecnica da Arden.

### Responsabilidades
- Criar/suspender/excluir contas de clientes
- Gerenciar planos e features
- Acessar contas para suporte (com log de auditoria)
- Criar/editar biblioteca global de templates PBQP-H
- Monitorar saude do sistema

### Restricoes Eticas
- **NUNCA alterar dados de verificacao** (NCs, conformidades, status)
- Acesso a contas sempre logado (auditoria completa)
- Idealmente pedir autorizacao do cliente antes de acessar

---

## Referencias

- Permissoes detalhadas: [../tech/03_RLS_PERMISSIONS.md](../tech/03_RLS_PERMISSIONS.md)
- Navegacao: [04_NAVIGATION.md](04_NAVIGATION.md)
