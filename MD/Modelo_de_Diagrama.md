![alt text](imgs/image.png)

status na Meta tem três estados: em_andamento, pausada e concluida. Quando uma meta é concluída, o campo concluida_em registra a data — isso vai te permitir exibir o histórico completo da trajetória até a conquista, que é o coração do projeto.

tipo no Registro é um enum com três valores: texto, imagem e audio. Mesmo que um registro possa ter os três ao mesmo tempo, o campo tipo serve para identificar qual é o conteúdo principal do registro, facilitando filtros e exibição.

imagem_url e audio_url armazenam apenas a URL do arquivo — o binário fica no Supabase Storage, o banco guarda só o endereço.