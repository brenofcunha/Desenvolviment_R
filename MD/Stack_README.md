# ⚙️ Stack Técnica — Desenvolviment_R

> Documento técnico complementar ao README conceitual. Descreve as tecnologias escolhidas e a arquitetura da aplicação.

---

## 🗂️ Stack

### Frontend (Web + Mobile)

| Camada | Tecnologia |

| Framework base | **React Native** |
| Navegação | **Expo Router** |
| Estilização | **NativeWind** (Tailwind para RN) |
| Calendário | **react-native-calendars** |
| Áudio | **expo-av** |
| Imagens | **expo-image-picker** |

### Backend

| Camada | Tecnologia |

| Linguagem | **Python** |
| Framework | **Django + Django REST Framework** |
| Banco de dados | **PostgreSQL** |
| ORM | **Django ORM** (nativo) |
| Armazenamento de mídia | **Supabase Storage** |
| Autenticação | **Supabase Auth** |

### Infraestrutura

| Camada | Tecnologia |

| Backend hosting | **Railway** ou **Render** |
| Banco + Storage | **Supabase** |
| App mobile (dev) | **Expo Go** |
| App mobile (produção) | **EAS Build** |

---

## 🔄 Arquitetura geral

[React Native + Expo]  ←→  [Django + DRF]  ←→  [PostgreSQL + Supabase]
   Web / iOS / Android       API REST             Dados + Mídia + Auth

---

## 💡 Por que essas escolhas?

- **React Native + Expo** — um único código para web, iOS e Android, com acesso nativo à câmera, galeria e áudio via Expo.
- **Django + DRF** — Python como linguagem principal, com o Django entregando ORM, painel admin e estrutura de projeto prontos. O DRF expõe tudo como API REST de forma limpa.
- **PostgreSQL** — banco relacional robusto, ideal para estruturar metas, registros e relacionamentos entre entidades.
- **Supabase** — camada gerenciada para banco, storage de mídia (imagens e áudios) e autenticação, gratuita para projetos pessoais.
- **Railway / Render** — deploy simples de aplicações Python/Django sem complexidade de infraestrutura.

---

## 🗺️ Ordem sugerida de desenvolvimento

1. **Modelagem do banco** — definir entidades: usuário, meta, registro (texto/imagem/áudio)
2. **Backend com Django** — criar models, serializers e endpoints via DRF
3. **Supabase** — configurar storage para mídia e autenticação
4. **Frontend com React Native + Expo** — construir telas consumindo a API
5. **Calendário e perfil** — implementar visualização temporal e customização

---

## 📌 Status

> 🚧 Stack definida — em fase de início do desenvolvimento.

---