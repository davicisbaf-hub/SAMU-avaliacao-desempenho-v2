CREATE TABLE bases (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    cor VARCHAR(20) NOT NULL
);


INSERT INTO public.bases (nome,cor) VALUES
	 ('Seropédica','#6366f1'),
	 ('Magé','#f43f5e'),
	 ('Itaguaí','#0ea5e9'),
	 ('Duque de Caxias','#febf2c'),
	 ('Belford Roxo','#5dc3ff'),
	 ('Mesquita','#7a49b4'),
	 ('Japeri','#028602'),
	 ('Nilópolis','#0e84bf'),
	 ('Nova Iguaçu','#ff5f00'),
	 ('Paracambi','#d3c358'),
	 ('São João de Meriti','#ffcf47'),
	 ('Queimados','#697e5d');