export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  story_order: number;
  author: {
    name: string;
    avatar: string | null;
    bio: string | null;
  };
}

export const mockPosts: Post[] = [
  {
    id: '1',
    title: 'O Início da Jornada',
    slug: 'o-inicio-da-jornada',
    excerpt: 'Tudo começou em uma manhã de primavera, quando o destino cruzou nossos caminhos de maneira inesperada.',
    content: `
      <p>Tudo começou em uma manhã de primavera, quando o destino cruzou nossos caminhos de maneira inesperada. O sol nascia preguiçoso no horizonte, pintando o céu com tons de laranja e rosa.</p>
      <p>Naquele momento, eu não sabia que minha vida estava prestes a mudar completamente. As ruas ainda estavam silenciosas, com apenas o som distante de pássaros anunciando um novo dia.</p>
      <h2>O Encontro</h2>
      <p>Foi então que vi pela primeira vez. Uma figura enigmática, parada na esquina, como se esperasse por algo — ou alguém. Nossos olhares se cruzaram por um breve instante, e naquele segundo, algo mudou dentro de mim.</p>
      <p>Essa é a história que preciso contar. Uma história sobre amor, perdas, descobertas e, acima de tudo, sobre encontrar o caminho de volta para casa.</p>
    `,
    cover_image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop',
    published: true,
    published_at: '2024-01-15T10:00:00Z',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    story_order: 1,
    author: {
      name: 'Ana Silva',
      avatar: null,
      bio: 'Escritora e sonhadora. Apaixonada por histórias que tocam a alma.',
    },
  },
  {
    id: '2',
    title: 'Atravessando o Deserto',
    slug: 'atravessando-o-deserto',
    excerpt: 'O caminho mais difícil às vezes é o único que nos leva aonde precisamos estar.',
    content: `
      <p>O caminho mais difícil às vezes é o único que nos leva aonde precisamos estar. O deserto se estendia infinito diante de mim, um mar de areia dourada sob o sol impiedoso.</p>
      <p>Cada passo era uma batalha contra o cansaço, contra a dúvida, contra a vontade de desistir. Mas havia algo dentro de mim que se recusava a parar.</p>
      <h2>A Prova de Fogo</h2>
      <p>O deserto não perdoa os fracos, mas também não recompensa apenas os fortes. Ele ensina que a verdadeira força está na persistência, na capacidade de dar mais um passo quando todos os seus instintos gritam para você parar.</p>
      <p>Foi nesse momento que entendi: a jornada não era sobre o destino, mas sobre quem eu me tornava no caminho.</p>
    `,
    cover_image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&auto=format&fit=crop',
    published: true,
    published_at: '2024-02-20T14:30:00Z',
    created_at: '2024-02-20T14:30:00Z',
    updated_at: '2024-02-20T14:30:00Z',
    story_order: 2,
    author: {
      name: 'Ana Silva',
      avatar: null,
      bio: 'Escritora e sonhadora. Apaixonada por histórias que tocam a alma.',
    },
  },
  {
    id: '3',
    title: 'O Oásis Escondido',
    slug: 'o-oasis-escondido',
    excerpt: 'Em meio à aridez, encontrei um refúgio que mudaria para sempre minha perspectiva.',
    content: `
      <p>Em meio à aridez, encontrei um refúgio que mudaria para sempre minha perspectiva. O oásis surgiu como uma miragem, mas dessa vez era real — tão real quanto o alívio que inundou meu coração.</p>
      <p>Palmeiras verdejantes emolduravam um lago cristalino, e pela primeira vez em semanas, senti esperança renovada.</p>
      <h2>Renovação</h2>
      <p>Ali, encontrei outros viajantes. Cada um com sua própria história, suas próprias cicatrizes. Descobri que não estava sozinha nessa jornada, e que às vezes, a companhia certa pode fazer toda a diferença.</p>
      <p>O oásis me ensinou sobre gratidão e sobre a importância de pausar para reconhecer as bênçãos ao longo do caminho.</p>
    `,
    cover_image: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&auto=format&fit=crop',
    published: true,
    published_at: '2024-03-10T09:15:00Z',
    created_at: '2024-03-10T09:15:00Z',
    updated_at: '2024-03-10T09:15:00Z',
    story_order: 3,
    author: {
      name: 'Ana Silva',
      avatar: null,
      bio: 'Escritora e sonhadora. Apaixonada por histórias que tocam a alma.',
    },
  },
  {
    id: '4',
    title: 'A Montanha Sagrada',
    slug: 'a-montanha-sagrada',
    excerpt: 'Subir a montanha foi o maior desafio até então, mas a vista do topo compensou cada sacrifício.',
    content: `
      <p>Subir a montanha foi o maior desafio até então, mas a vista do topo compensou cada sacrifício. A Montanha Sagrada erguia-se imponente, seus picos nevados tocando as nuvens.</p>
      <p>Cada metro de altitude era conquistado com suor e determinação. O ar rarefeito desafiava meus pulmões, mas meu espírito permanecia inabalável.</p>
      <h2>A Escalada</h2>
      <p>No caminho, encontrei símbolos antigos esculpidos nas rochas — mensagens deixadas por aqueles que vieram antes de mim. Cada símbolo contava uma parte da história maior, uma história que eu agora fazia parte.</p>
      <p>No topo, com o mundo aos meus pés, finalmente entendi o propósito da jornada.</p>
    `,
    cover_image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop',
    published: true,
    published_at: '2024-04-05T16:45:00Z',
    created_at: '2024-04-05T16:45:00Z',
    updated_at: '2024-04-05T16:45:00Z',
    story_order: 4,
    author: {
      name: 'Ana Silva',
      avatar: null,
      bio: 'Escritora e sonhadora. Apaixonada por histórias que tocam a alma.',
    },
  },
  {
    id: '5',
    title: 'O Retorno ao Lar',
    slug: 'o-retorno-ao-lar',
    excerpt: 'Depois de tudo, voltar para casa revelou que a maior transformação havia acontecido dentro de mim.',
    content: `
      <p>Depois de tudo, voltar para casa revelou que a maior transformação havia acontecido dentro de mim. As mesmas ruas que eu conhecia tão bem pareciam diferentes — ou talvez eu é que fosse diferente.</p>
      <p>O lar que deixei não era mais o mesmo, mas eu finalmente entendia que não era o lugar que precisava mudar, e sim minha forma de enxergar o mundo.</p>
      <h2>A Revelação</h2>
      <p>A jornada me ensinou que casa não é um lugar, é um sentimento. É pertencer a algo maior que nós mesmos, é encontrar paz em meio ao caos.</p>
      <p>E assim, minha história encontrou seu fim — ou seria seu novo começo? Afinal, toda chegada é também uma partida para uma nova aventura.</p>
    `,
    cover_image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&auto=format&fit=crop',
    published: true,
    published_at: '2024-05-01T11:00:00Z',
    created_at: '2024-05-01T11:00:00Z',
    updated_at: '2024-05-01T11:00:00Z',
    story_order: 5,
    author: {
      name: 'Ana Silva',
      avatar: null,
      bio: 'Escritora e sonhadora. Apaixonada por histórias que tocam a alma.',
    },
  },
];

// Helper to get posts by story order
export const getPostsByStoryOrder = (posts: Post[]) => {
  return [...posts].sort((a, b) => a.story_order - b.story_order);
};

// Helper to get posts by publication date (chronological)
export const getPostsByDate = (posts: Post[]) => {
  return [...posts].sort((a, b) => {
    const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
    const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
    return dateB - dateA;
  });
};
