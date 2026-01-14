"Atue como um Agente Inicializador. Sua tarefa é preparar o ambiente de desenvolvimento para um loop autônomo de longa duração (Ralph Loop) baseado no arquivo [NOME_DO_SEU_ARQUIVO_DE_DOCUMENTAÇÃO.md].
Gere os três arquivos a seguir seguindo rigorosamente estas estruturas:
1. Crie o arquivo plan.md: Este arquivo deve conter uma lista de requisitos no formato JSON (dentro de blocos de código). As fontes indicam que o JSON é mais resiliente a erros de edição da IA. Cada tarefa deve seguir este esquema:
{
  "category": "funcional/UI/backend",
  "description": "Descrição clara da tarefa",
  "steps": ["passo 1 de teste", "passo 2 de teste"],
  "status": "failing"
}
• Importante: Todas as tarefas devem iniciar com "status": "failing" para garantir que o agente de codificação tenha um roteiro claro do que falta.
2. Crie o arquivo activity.md: Um arquivo Markdown simples para log de progresso. Ele deve começar com um cabeçalho: # Registro de Atividade. Este arquivo servirá para o agente entender o que foi feito em sessões anteriores, superando a falta de memória entre janelas de contexto.
3. Crie o arquivo PROMPT.md: Este arquivo deve conter o texto exato que eu usarei para iniciar o loop. O texto deve ser:
"Leia o activity.md para se situar e o plan.md para escolher a tarefa de maior prioridade com status: failing.
1. Inicie o servidor local e valide o estado atual usando o Claude no Chrome (verifique logs e visual).
2. Implemente a mudança de uma única tarefa por vez.
3. Valide a implementação no navegador e via testes/build.
4. Atualize o activity.md com o que foi feito e mude o status no plan.md para passing apenas se o teste for bem-sucedido.
5. Faça um commit git curto.
6. Repita até que tudo esteja como passing. Ao terminar tudo, imprima apenas: COMPLETE."
Ao finalizar a criação dos arquivos, informe que o ambiente está pronto e forneça o comando: /ralph loop [CONTEÚDO_DE_PROMPT.MD] --max-iterations 20 --completion-promise COMPLETE."