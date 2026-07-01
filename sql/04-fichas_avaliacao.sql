CREATE TABLE fichas_avaliacao (
    id SERIAL PRIMARY KEY,
    icon VARCHAR(50),
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    criterios INTEGER NOT NULL,
    tags TEXT[] DEFAULT '{}',
    link VARCHAR(100) NOT NULL,
    ordem INTEGER DEFAULT 0,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);
INSERT INTO public.fichas_avaliacao (icon,nome,descricao,criterios,tags,link,ordem,ativo,created_at) VALUES
	 ('🚑','Condutor','15 critérios de avaliação',15,'{Técnico,Comportamental,Processo}','/avaliacao/condutor-socorrista',1,true,'2026-06-17 09:02:37.183076'),
	 ('💉','Técnico de Enfermagem','14 critérios de avaliação',14,'{Técnico,Comportamental,Processo}','/avaliacao/tecnico-enfermagem',2,true,'2026-06-17 09:02:37.183076'),
	 ('🩺','Enfermeiro','14 critérios de avaliação',14,'{Técnico,Comportamental,Processo,bp-TEAM}','/avaliacao/enfermeiro',3,true,'2026-06-17 09:02:37.183076'),
	 ('⚕️','Médico','14 critérios de avaliação',14,'{Técnico,Comportamental,Processo,bp-TEAM}','/avaliacao/medico-intervencionista',4,true,'2026-06-17 09:02:37.183076'),
	 ('👤','Liderança > Liderado','12 critérios de avaliação',12,'{Técnico,Comportamental,Processo}','/avaliacao/lideranca-liderado',5,true,'2026-06-17 09:02:37.183076'),
	 ('👤','Liderado > Liderança','12 critérios de avaliação',12,'{Técnico,Comportamental,Processo}','/avaliacao/liderado-lideranca',6,true,'2026-06-17 09:02:37.183076'),
	 ('🛡️','Simulação bp-TEAM','11 critérios - 3 domínios + NTS',11,'{bp-TEAM,NTS}','/avaliacao/bp-team',7,true,'2026-06-17 09:02:37.183076'),
     ('👥','Avaliação dos Pares','3 critérios de avaliação',3,'{Técnico,Comportamental,Processo}','/avaliacao/par',8,true,'2026-06-23 19:02:37.183076');
