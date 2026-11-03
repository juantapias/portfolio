import type { Project } from '../types/projects'

/**
 * Casos de estudio. El orden del array es el orden de la grilla (el primero
 * se muestra destacado a ancho completo).
 *
 * Reglas SEO (se verifican en el build, ver utils/project.ts → auditProjects):
 * - seo.title ≤ 52 caracteres (el layout añade " — Tapias")
 * - seo.description entre 120 y 160 caracteres e incluye seo.primaryKeyword
 * - coverAlt descriptivo en ambos idiomas
 */
export const projects: Project[] = [
  // ─────────────────────────────────────────── 404 Studio
  {
    slug: '404-studio',
    client: '404 Studio',
    projectType: 'client',
    status: 'completed',

    country: 'Colombia',
    year: 2026,
    launchedAt: '2026-11',
    durationWeeks: 4,

    website: 'https://somos404studio.com',

    coverImage: '/images/projects/404-studio/cover.webp',
    ogImage: '/images/projects/404-studio/og.jpg',
    video:
      'https://res.cloudinary.com/dcuocptj7/video/upload/v1793729868/404_fqeta4.mov',

    techStack: ['Next.js', 'Supabase'],

    translations: {
      es: {
        name: '404 Studio',
        category: 'Ecommerce',
        industry: 'Arte y decoración',
        coverAlt:
          'Sala con cuadros de autos clásicos de 404 Studio colgados sobre un sofá',

        overview: {
          short:
            'Diseño y desarrollo del ecommerce de 404 Studio, una marca colombiana de cuadros y prints, con un flujo de compra pensado para personalizar cada pieza y decorar por espacios.',
          medium:
            '404 Studio no tenía presencia digital y quería vender sus cuadros en línea para llegar a más personas. El proyecto abarcó la estructura del modelo de negocio, el diseño de la experiencia de compra y el desarrollo a medida de una tienda que permite configurar cada pieza, combinarla con otras y comprarla en pocos pasos.',
          long: '404 Studio es una marca colombiana que diseña cuadros y prints con historia propia. Antes del proyecto no contaba con un canal digital, lo que limitaba su alcance. El objetivo era construir una tienda en línea que transmitiera la personalidad de la marca y convirtiera visitas en compras en toda Colombia.\n\nAntes de diseñar pantallas se definió la estructura del negocio: catálogo, formatos y precios por tamaño, acabados, sets de varias piezas, descuentos por volumen y envíos. Sobre esa base se diseñó un flujo de compra por pasos —soporte, formato, marco y paspartú— que actualiza el precio en cada elección y calcula el envío antes de pagar.\n\nLa tienda se desarrolló a medida con Next.js y Supabase e incluye herramientas que inspiran la compra: navegación por espacios del hogar, sets prediseñados, piezas personalizadas, lista de guardados y "Arma tu pared", un simulador que permite componer una pared a escala real y enviar la composición completa al carrito.',
        },

        challenge:
          'La marca no tenía presencia digital y necesitaba un canal propio para vender y llegar a más personas. El reto era convertir un catálogo con muchas variables —tamaños, soportes, marcos y acabados— en una experiencia de compra simple, sin perder la personalidad de la marca.',
        solution:
          'Se estructuró el modelo de negocio y se diseñó un ecommerce a medida con un configurador por pasos, precios dinámicos y cálculo de envío. La experiencia se complementa con compra por espacios, sets, descuentos por volumen y un simulador de pared que facilita la decisión y anima a comprar varias piezas.',

        features: [
          'Ecommerce desarrollado a medida',
          'Configurador de producto por pasos',
          'Precios dinámicos según tamaño y acabados',
          'Simulador "Arma tu pared" a escala real',
          'Compra por espacios del hogar',
          'Sets de cuadros prediseñados',
          'Descuentos automáticos por volumen',
          'Cálculo de envío antes del pago',
          'Cuentas de usuario y lista de guardados',
          'Piezas personalizadas',
        ],
        responsibilities: [
          'Estructura del modelo de negocio',
          'Arquitectura de información',
          'Diseño UI/UX',
          'Diseño del flujo de compra',
          'Desarrollo frontend',
          'Desarrollo backend',
          'Modelado de base de datos',
          'Optimización SEO',
        ],
        tags: [
          'Ecommerce',
          'Diseño UI/UX',
          'Fullstack',
          'Flujo de compra',
          'Configurador de producto',
          'SEO',
          'Decoración',
        ],

        seo: {
          title: '404 Studio: ecommerce a medida de cuadros y prints',
          description:
            'Ecommerce a medida para 404 Studio en Next.js y Supabase: configurador de cuadros por pasos, simulador de pared, compra por espacios y envíos a Colombia.',
          primaryKeyword: 'ecommerce a medida',
        },
      },

      en: {
        name: '404 Studio',
        category: 'Ecommerce',
        industry: 'Art & Home Decor',
        coverAlt:
          'Living room with 404 Studio classic car prints framed above a sofa',

        overview: {
          short:
            'Design and development of the ecommerce store for 404 Studio, a Colombian brand of framed art and prints, with a checkout flow built to customize every piece and decorate room by room.',
          medium:
            '404 Studio had no digital presence and wanted to sell its framed art online to reach more people. The project covered the business model structure, the shopping experience design, and the custom development of a store where customers configure each piece, combine it with others, and buy it in a few steps.',
          long: '404 Studio is a Colombian brand that designs framed art and prints, each with its own story. Before this project it had no digital sales channel, which limited its reach. The goal was to build an online store that conveyed the brand\'s personality and turned visits into purchases across Colombia.\n\nBefore designing any screens, the business structure was defined: catalog, formats and pricing by size, finishes, multi-piece sets, volume discounts, and shipping. On that foundation, a step-by-step purchase flow was designed —medium, format, frame, and mat— that updates the price with every choice and calculates shipping before checkout.\n\nThe store was custom-built with Next.js and Supabase and includes tools that inspire purchases: shopping by room, curated sets, custom pieces, a wishlist, and "Build your wall", a simulator that lets customers compose a wall at real scale and send the entire composition to the cart.',
        },

        challenge:
          "The brand had no digital presence and needed its own channel to sell and reach more people. The challenge was turning a catalog with many variables —sizes, mediums, frames, and finishes— into a simple shopping experience without losing the brand's personality.",
        solution:
          'The business model was structured and a custom ecommerce store was designed with a step-by-step configurator, dynamic pricing, and shipping calculation. The experience is complemented by shopping by room, sets, volume discounts, and a wall simulator that makes decisions easier and encourages multi-piece orders.',

        features: [
          'Custom-built ecommerce',
          'Step-by-step product configurator',
          'Dynamic pricing by size and finish',
          'Real-scale "Build your wall" simulator',
          'Shopping by room',
          'Curated frame sets',
          'Automatic volume discounts',
          'Shipping calculation before checkout',
          'User accounts and wishlist',
          'Custom pieces',
        ],
        responsibilities: [
          'Business Model Structure',
          'Information Architecture',
          'UI/UX Design',
          'Checkout Flow Design',
          'Frontend Development',
          'Backend Development',
          'Database Modeling',
          'SEO Optimization',
        ],
        tags: [
          'Ecommerce',
          'UI/UX Design',
          'Fullstack',
          'Checkout Flow',
          'Product Configurator',
          'SEO',
          'Home Decor',
        ],

        seo: {
          title: '404 Studio: Custom Ecommerce for Art Prints',
          description:
            'Custom ecommerce for 404 Studio built with Next.js and Supabase: a step-by-step frame configurator, wall simulator, shopping by room, and nationwide shipping.',
          primaryKeyword: 'custom ecommerce',
        },
      },
    },
  },

  // ─────────────────────────────────────────── Menuestro
  {
    slug: 'menuestro',
    client: 'Menuestro',
    projectType: 'personal',
    status: 'completed',

    country: 'Colombia',
    year: 2026,
    durationWeeks: 5,

    website: 'https://menuestro.com',

    coverImage: '/images/projects/menuestro/cover.webp',
    ogImage: '/images/projects/menuestro/og.jpg',
    video:
      'https://res.cloudinary.com/dcuocptj7/video/upload/v1793729433/menuestro_r0rmy7.mov',

    techStack: ['Next.js', 'Supabase', 'Tailwind CSS', 'Vercel'],

    translations: {
      es: {
        name: 'Menuestro',
        category: 'Plataforma SaaS',
        industry: 'Tecnología para restaurantes',
        coverAlt:
          'Página de inicio de Menuestro con el titular "Tu restaurante vende directo, en tu dominio" y una fila de tickets de pedidos, reservas y pagos',

        overview: {
          short:
            'Plataforma SaaS todo en uno para restaurantes que centraliza menús digitales con QR, reservas online, promociones, analíticas y gestión comercial desde un único panel administrativo.',
          medium:
            'Menuestro fue creado para resolver uno de los principales problemas de digitalización en el sector gastronómico latinoamericano: el uso de herramientas fragmentadas y procesos manuales para gestionar menús, reservas y operaciones comerciales. La plataforma permite a cada restaurante administrar su presencia digital desde una única solución escalable y fácil de utilizar.',
          long: 'Menuestro es una plataforma SaaS multi-tenant diseñada para ayudar a restaurantes a digitalizar sus operaciones sin depender de múltiples herramientas desconectadas. El producto permite crear menús digitales accesibles mediante QR, recibir reservas online, gestionar promociones, organizar productos y categorías, administrar clientes y visualizar métricas clave del negocio desde un único panel centralizado.\n\nCada restaurante obtiene su propio espacio independiente dentro de la plataforma, incluyendo una URL pública personalizada donde los clientes pueden consultar la carta digital, realizar reservas y acceder a información actualizada del negocio sin necesidad de instalar aplicaciones adicionales.\n\nEl proyecto fue concebido, diseñado y desarrollado de forma integral, abarcando investigación del problema, definición de producto, experiencia de usuario, arquitectura técnica, desarrollo fullstack y despliegue. El resultado es una solución escalable orientada a reducir la complejidad tecnológica para negocios gastronómicos y facilitar su transformación digital.',
        },

        challenge:
          'La industria gastronómica en Latinoamérica continúa operando con procesos manuales y herramientas aisladas para gestionar menús, reservas y operaciones comerciales. El desafío consistía en diseñar una solución unificada capaz de simplificar estos procesos, reducir la dependencia tecnológica y ofrecer una experiencia intuitiva para usuarios con conocimientos técnicos limitados.',
        solution:
          'Se desarrolló una plataforma SaaS multi-tenant que centraliza la gestión de menús digitales, reservas, promociones, analíticas y operaciones comerciales. La experiencia fue diseñada para que cualquier restaurante pueda configurar y administrar su presencia digital en pocos minutos mediante un panel administrativo intuitivo y escalable.',

        features: [
          'Sistema SaaS multi-tenant',
          'Autenticación y gestión de usuarios',
          'Menús digitales mediante QR',
          'URLs públicas personalizadas',
          'Gestión de categorías y productos',
          'Gestión de promociones',
          'Sistema de reservas online',
          'CRM para gestión de clientes',
          'Módulo de ecommerce',
          'Dashboard administrativo',
          'Analíticas de negocio',
          'Métricas de ventas y reservas',
          'Planes de suscripción',
          'Experiencia multidioma para clientes',
        ],
        responsibilities: [
          'Investigación de producto',
          'Definición de requerimientos',
          'Diseño UI/UX',
          'Arquitectura de información',
          'Diseño del sistema',
          'Desarrollo frontend',
          'Desarrollo backend',
          'Modelado de base de datos',
          'Implementación de autenticación',
          'Despliegue y DevOps',
        ],
        tags: [
          'SaaS',
          'Dashboard',
          'Multi-tenant',
          'Tecnología gastronómica',
          'Diseño de producto',
          'UI/UX',
          'Fullstack',
          'Analíticas',
          'Reservas',
        ],

        seo: {
          title: 'Menuestro: SaaS de menús digitales y reservas',
          description:
            'Menuestro, software para restaurantes con menús QR, reservas online, promociones y analíticas en un solo panel. Producto diseñado y desarrollado a medida.',
          primaryKeyword: 'software para restaurantes',
        },
      },

      en: {
        name: 'Menuestro',
        category: 'SaaS Platform',
        industry: 'Restaurant Technology',
        coverAlt:
          'Menuestro homepage hero with the headline "Your restaurant sells direct, on your own domain" and a row of order, reservation and payment tickets',

        overview: {
          short:
            'All-in-one SaaS platform for restaurants that centralizes digital QR menus, online reservations, promotions, analytics, and business management through a single administrative dashboard.',
          medium:
            'Menuestro was created to solve one of the biggest digitalization challenges in the Latin American restaurant industry: fragmented tools and manual processes used to manage menus, reservations, and commercial operations. The platform enables restaurants to manage their digital presence through a single scalable solution.',
          long: 'Menuestro is a multi-tenant SaaS platform designed to help restaurants digitize their operations without relying on disconnected tools. The platform enables businesses to create QR-powered digital menus, receive online reservations, manage promotions, organize products and categories, oversee customer relationships, and track key business metrics through a centralized dashboard.\n\nEach restaurant receives its own independent workspace, including a personalized public URL where customers can browse menus, make reservations, and access updated business information without installing any additional applications.\n\nThe project was entirely conceived, designed, and developed from the ground up, covering product discovery, UX design, technical architecture, fullstack development, and deployment. The result is a scalable solution that reduces operational complexity while accelerating digital adoption across the restaurant industry.',
        },

        challenge:
          'Restaurants across Latin America still rely heavily on manual processes and disconnected tools to manage menus, reservations, and business operations. The challenge was to design a unified solution that simplifies these workflows while remaining accessible to users with limited technical expertise.',
        solution:
          'A multi-tenant SaaS platform was developed to centralize digital menus, reservations, promotions, analytics, and business operations. The experience was designed so restaurant owners can launch and manage their digital presence within minutes through an intuitive and scalable administrative dashboard.',

        features: [
          'Multi-tenant SaaS architecture',
          'Authentication and user management',
          'QR-powered digital menus',
          'Custom public URLs',
          'Category and product management',
          'Promotion management',
          'Online reservation system',
          'Customer relationship management (CRM)',
          'Ecommerce module',
          'Administrative dashboard',
          'Business analytics',
          'Sales and reservation metrics',
          'Subscription plans',
          'Multilingual customer experience',
        ],
        responsibilities: [
          'Product Research',
          'Requirements Definition',
          'UI/UX Design',
          'Information Architecture',
          'System Design',
          'Frontend Development',
          'Backend Development',
          'Database Modeling',
          'Authentication Implementation',
          'Deployment and DevOps',
        ],
        tags: [
          'SaaS',
          'Dashboard',
          'Multi-tenant',
          'Restaurant Tech',
          'Product Design',
          'UI/UX',
          'Fullstack',
          'Analytics',
          'Reservations',
        ],

        seo: {
          title: 'Menuestro: SaaS for Digital Menus & Bookings',
          description:
            'Menuestro, restaurant management software with QR digital menus, online reservations, promotions, and analytics in one dashboard. Designed and built end to end.',
          primaryKeyword: 'restaurant management software',
        },
      },
    },
  },

  // ─────────────────────────────────────────── Diagnóstico CIC
  {
    slug: 'diagnostico-cic',
    client: 'Diagnóstico CIC',
    projectType: 'client',
    status: 'completed',

    country: 'Argentina',
    year: 2026,
    durationWeeks: 3,

    website: 'https://diagnosticocic.com.ar/',

    coverImage:
      'https://res.cloudinary.com/dcuocptj7/image/upload/v1780336071/cover-img-cic_krc91m.webp',
    video:
      'https://res.cloudinary.com/dcuocptj7/video/upload/v1779980331/CIC_u3kfb4.mov',

    techStack: ['WordPress', 'Elementor Pro', 'Figma'],

    translations: {
      es: {
        name: 'Diagnóstico CIC',
        category: 'Sitio web corporativo',
        industry: 'Salud',
        coverAlt:
          'Profesional de Diagnóstico CIC preparando una muestra frente al logotipo de la clínica',

        overview: {
          short:
            'Rediseño completo de la presencia digital de Diagnóstico CIC, transformando una experiencia single page limitada en una plataforma multipágina moderna, clara y enfocada en la accesibilidad de la información médica.',
          medium:
            'Diagnóstico CIC fue rediseñado para reemplazar una experiencia single page desactualizada por una plataforma multipágina moderna enfocada en mejorar la navegación, la organización de servicios y la accesibilidad para pacientes. El proyecto priorizó una experiencia visual más clara, una arquitectura de contenido escalable y una interacción intuitiva para facilitar la consulta de información médica.',
          long: 'El proyecto de Diagnóstico CIC consistió en la transformación completa de una web single page con problemas de navegación, distribución de contenido y experiencia de usuario. El objetivo principal fue crear una plataforma multipágina moderna que permitiera comunicar de forma clara los servicios médicos ofrecidos por la clínica, mejorando tanto la accesibilidad como la comprensión de la información por parte de los pacientes.\n\nTrabajando en conjunto con el cliente y el diseñador, se definió una nueva arquitectura de contenido orientada a facilitar la navegación y organizar mejor las diferentes áreas y servicios de la clínica. El proyecto incluyó diseño visual personalizado, implementación responsive, optimización SEO y una experiencia dinámica para la sección de consultas, permitiendo alternar fácilmente entre consultas para adultos y jóvenes/niños de manera intuitiva y accesible.',
        },

        challenge:
          'La versión anterior del sitio presentaba una navegación limitada, poca información disponible y una estructura single page que dificultaba el acceso a los diferentes servicios de la clínica. Además del rediseño visual, el principal reto fue reorganizar el contenido y construir una experiencia más clara, moderna y fácil de entender para distintos tipos de pacientes.',
        solution:
          'Se diseñó una nueva experiencia multipágina completamente personalizada enfocada en mejorar la jerarquía visual, la accesibilidad de la información y la navegación general del sitio. La estructura fue pensada para permitir que los usuarios encontraran rápidamente servicios, consultas y contenido relevante mediante una experiencia limpia, moderna y adaptable a cualquier dispositivo.',

        features: [
          'Rediseño completo de experiencia y navegación',
          'Arquitectura de contenido multipágina',
          'Diseño visual personalizado',
          'Experiencia responsive optimizada',
          'Optimización SEO',
          'Sección dinámica de consultas médicas',
          'Integración con sistema de registros médicos',
          'Jerarquía visual enfocada en accesibilidad',
        ],
        responsibilities: [
          'Dirección e implementación frontend',
          'Apoyo en decisiones creativas y UX',
          'Implementación responsive',
          'Optimización SEO',
          'Integración de formularios',
          'Estructuración de contenido',
          'Implementación en WordPress y Elementor',
        ],
        tags: ['UI/UX', 'Frontend', 'SEO', 'Diseño responsive', 'CMS', 'Salud'],

        seo: {
          title: 'Diagnóstico CIC: rediseño web para una clínica',
          description:
            'Diseño web para clínicas: rediseño de Diagnóstico CIC, de una web single page a una plataforma multipágina accesible, clara y optimizada para pacientes.',
          primaryKeyword: 'diseño web para clínicas',
        },
      },

      en: {
        name: 'Diagnóstico CIC',
        category: 'Corporate Website',
        industry: 'Healthcare',
        coverAlt:
          'Diagnóstico CIC lab professional preparing a sample in front of the clinic logo',

        overview: {
          short:
            'A complete redesign of Diagnóstico CIC’s digital presence, transforming a limited single-page experience into a modern multi-page platform focused on clarity, accessibility, and patient trust.',
          medium:
            'Diagnóstico CIC was redesigned to replace an outdated single-page website with a modern multi-page platform focused on improving navigation, service discovery, and information accessibility for patients. The project emphasized a cleaner visual experience, scalable content architecture, and intuitive interactions that make healthcare information easier to explore and understand.',
          long: 'The Diagnóstico CIC project involved the complete transformation of an outdated single-page website that suffered from navigation limitations, insufficient information structure, and a poor user experience. The primary goal was to create a modern multi-page platform capable of communicating the clinic’s medical services more effectively while improving accessibility and information clarity for patients.\n\nWorking closely with both the client and the design team, a new content architecture was defined to organize services more efficiently and create a smoother navigation experience. The project included custom visual design, responsive implementation, SEO optimization, and a dynamic consultation experience that allows users to seamlessly switch between adult and pediatric consultation categories through a clear and intuitive interface.',
        },

        challenge:
          'The previous website provided limited navigation, insufficient service information, and a single-page structure that made it difficult for users to access relevant healthcare content. Beyond the visual redesign, the main challenge was reorganizing information into a more intuitive, accessible, and patient-friendly experience.',
        solution:
          'A fully customized multi-page experience was designed to improve visual hierarchy, information accessibility, and overall navigation. The new structure was crafted to help users quickly discover services, consultations, and relevant content through a clean, modern, and responsive experience across all devices.',

        features: [
          'Complete UX and navigation redesign',
          'Multi-page content architecture',
          'Custom visual design',
          'Responsive experience across devices',
          'SEO optimization',
          'Dynamic medical consultation section',
          'Medical records system integration',
          'Accessibility-focused visual hierarchy',
        ],
        responsibilities: [
          'Frontend Implementation and Development',
          'Creative and UX Collaboration',
          'Responsive Development',
          'SEO Optimization',
          'Form Integration',
          'Content Structuring',
          'WordPress and Elementor Implementation',
        ],
        tags: [
          'UI/UX',
          'Frontend',
          'SEO',
          'Responsive Design',
          'CMS',
          'Healthcare',
        ],

        seo: {
          title: 'Diagnóstico CIC: Healthcare Website Redesign',
          description:
            'Healthcare website design for Diagnóstico CIC: a single-page site rebuilt as a clear, accessible multi-page platform that helps patients find services fast.',
          primaryKeyword: 'healthcare website design',
        },
      },
    },
  },

  // ─────────────────────────────────────────── Pacific Waves Hostel & Surf
  {
    slug: 'pacific-waves-hostel-and-surf',
    client: 'Pacific Waves Hostel & Surf',
    projectType: 'client',
    status: 'completed',

    country: 'Colombia',
    year: 2025,
    durationWeeks: 3,

    website: 'https://pacificwaveshostel.com/',

    coverImage:
      'https://res.cloudinary.com/dcuocptj7/image/upload/v1747193717/pacific-waves-hostel-4_j9vi8e.webp',
    video:
      'https://res.cloudinary.com/dcuocptj7/video/upload/v1781014504/pacific-waves-hostel_ldqsbe.mov',

    techStack: ['Astro', 'React', 'GSAP', 'Figma', 'Cloudbeds'],

    translations: {
      es: {
        name: 'Pacific Waves Hostel & Surf',
        category: 'Sitio web corporativo',
        industry: 'Turismo',
        coverAlt:
          'Cabañas de Pacific Waves Hostel & Surf rodeadas de selva en El Valle, Chocó',

        overview: {
          short:
            'Diseño y desarrollo de la primera presencia digital de Pacific Waves Hostel & Surf, creando una experiencia enfocada en generar confianza, destacar sus experiencias turísticas y facilitar el proceso de reserva.',
          medium:
            'Pacific Waves Hostel & Surf necesitaba una presencia digital capaz de transmitir la esencia de El Valle, Bahía Solano y convertir visitantes en huéspedes. El proyecto combinó diseño visual, experiencia de usuario y una estructura orientada a reservas para presentar de forma clara alojamientos, experiencias de surf, avistamiento de ballenas y rutas ecológicas.',
          long: 'Pacific Waves Hostel & Surf nació con la necesidad de construir su primera presencia digital y ofrecer una plataforma capaz de transmitir la experiencia única que brinda a sus visitantes en El Valle, Bahía Solano, Chocó. El objetivo principal era generar confianza, presentar sus servicios de manera atractiva y facilitar el acceso al proceso de reserva.\n\nEl proyecto fue diseñado desde cero, combinando una identidad visual inspirada en la naturaleza, el surf y la tranquilidad del entorno. Se trabajó cuidadosamente la arquitectura de contenido para destacar alojamientos, planes turísticos, clases de surf, avistamiento de ballenas y experiencias ecológicas, guiando al usuario hacia la reserva mediante una navegación intuitiva y llamadas a la acción estratégicamente ubicadas.\n\nAdemás, se incorporaron microinteracciones y animaciones de desplazamiento para enriquecer la experiencia sin afectar la usabilidad, mientras que las integraciones con Cloudbeds permitieron conectar los diferentes puntos de reserva dentro del recorrido del usuario.',
        },

        challenge:
          'Crear la primera presencia digital de la marca implicaba construir credibilidad desde cero y transformar una experiencia turística física en una experiencia digital atractiva. El desafío consistía en comunicar múltiples servicios y actividades sin generar fricción, manteniendo siempre visible el camino hacia la reserva.',
        solution:
          'Se diseñó una experiencia digital enfocada en la exploración y la conversión, priorizando el contenido visual, la claridad de los planes disponibles y un flujo de navegación orientado a reservas. La estructura del sitio fue construida para transmitir confianza, facilitar la comprensión de los servicios y conectar al usuario con la plataforma de reservas mediante puntos estratégicos de interacción.',

        features: [
          'Diseño visual completamente personalizado',
          'Arquitectura de contenido orientada a conversión',
          'Página dedicada a planes y experiencias',
          'Integración con plataforma de reservas Cloudbeds',
          'Microinteracciones y animaciones con GSAP',
          'Experiencia responsive optimizada',
          'Optimización SEO',
          'Navegación enfocada en reservas',
        ],
        responsibilities: [
          'Diseño UI/UX',
          'Arquitectura de información',
          'Diseño visual',
          'Desarrollo frontend',
          'Desarrollo fullstack',
          'Implementación responsive',
          'Integración con Cloudbeds',
          'Optimización SEO',
          'Animaciones e interacciones',
        ],
        tags: [
          'UI/UX',
          'Frontend',
          'Animación',
          'Hotelería',
          'Experiencia de reservas',
          'Diseño responsive',
          'SEO',
          'Branding',
        ],

        seo: {
          title: 'Pacific Waves: diseño web para hostal de surf',
          description:
            'Diseño web para hoteles: la primera web de Pacific Waves Hostel & Surf en Astro, enfocada en reservas con Cloudbeds y en sus experiencias en el Pacífico.',
          primaryKeyword: 'diseño web para hoteles',
        },
      },

      en: {
        name: 'Pacific Waves Hostel & Surf',
        category: 'Corporate Website',
        industry: 'Tourism',
        coverAlt:
          'Pacific Waves Hostel & Surf cabins surrounded by jungle in El Valle, Chocó',

        overview: {
          short:
            'Design and development of Pacific Waves Hostel & Surf’s first digital presence, creating an experience focused on building trust, showcasing travel experiences, and simplifying the booking journey.',
          medium:
            'Pacific Waves Hostel & Surf needed a digital presence capable of capturing the essence of El Valle, Bahía Solano while converting visitors into guests. The project combined visual design, user experience, and a booking-oriented structure to showcase accommodations, surf experiences, whale watching, and eco-tourism activities.',
          long: 'Pacific Waves Hostel & Surf required its first digital platform to communicate the unique experience it offers visitors in El Valle, Bahía Solano, Chocó. The primary goal was to build trust, present services in an engaging way, and provide a seamless path toward reservations.\n\nThe project was designed from the ground up, combining a visual identity inspired by nature, surfing, and the tranquility of the Pacific coast. Content architecture was carefully crafted to highlight accommodations, travel packages, surf lessons, whale watching, and eco-tourism experiences, guiding visitors toward booking actions through intuitive navigation and strategically placed calls to action.\n\nTo enrich the experience, subtle microinteractions and scroll-based animations were implemented, while Cloudbeds integrations connected users to reservation flows throughout the site journey.',
        },

        challenge:
          'Building the brand’s first digital presence meant establishing credibility from scratch and translating a real-world tourism experience into an engaging online journey. The challenge was to communicate multiple services and activities while keeping the booking path simple and visible.',
        solution:
          'A conversion-focused digital experience was designed around exploration, storytelling, and booking accessibility. The website structure prioritized visual content, clear presentation of travel packages, and strategic interactions that guide users toward reservations while reinforcing trust in the brand.',

        features: [
          'Custom visual design',
          'Conversion-focused content architecture',
          'Dedicated travel packages page',
          'Cloudbeds booking integration',
          'GSAP-powered microinteractions',
          'Responsive experience',
          'SEO optimization',
          'Reservation-oriented navigation',
        ],
        responsibilities: [
          'UI/UX Design',
          'Information Architecture',
          'Visual Design',
          'Frontend Development',
          'Fullstack Development',
          'Responsive Implementation',
          'Cloudbeds Integration',
          'SEO Optimization',
          'Animations and Interactions',
        ],
        tags: [
          'UI/UX',
          'Frontend',
          'Animation',
          'Hospitality',
          'Booking Experience',
          'Responsive Design',
          'SEO',
          'Branding',
        ],

        seo: {
          title: 'Pacific Waves: Website Design for a Surf Hostel',
          description:
            'Hotel website design for Pacific Waves Hostel & Surf: its first website, built with Astro, focused on Cloudbeds bookings and its Pacific coast experiences.',
          primaryKeyword: 'hotel website design',
        },
      },
    },
  },

  // ─────────────────────────────────────────── Química Danez
  {
    slug: 'quimica-danez',
    client: 'Química Danez',
    projectType: 'client',
    status: 'completed',

    country: 'Argentina',
    year: 2026,
    durationWeeks: 3,

    website: 'https://quimicadanez.com/',

    coverImage:
      'https://res.cloudinary.com/dcuocptj7/image/upload/v1780413086/conver-img-quimica-danez_nktp1s.webp',
    video:
      'https://res.cloudinary.com/dcuocptj7/video/upload/v1773947692/danez_mx7luz.mov',

    techStack: ['WordPress', 'Elementor Pro'],

    translations: {
      es: {
        name: 'Química Danez',
        category: 'Catálogo digital',
        industry: 'Productos químicos',
        coverAlt:
          'Planta de producción industrial con el logotipo de Química Danez',

        overview: {
          short:
            'Diseño y desarrollo de una plataforma digital orientada a presentar el catálogo de productos de Química Danez, fortaleciendo su presencia online y facilitando la generación de cotizaciones.',
          medium:
            'Química Danez necesitaba una presencia digital capaz de comunicar sus productos de limpieza industrial y posicionar la marca en internet. El proyecto se enfocó en crear un catálogo digital claro, profesional y optimizado para facilitar la consulta de productos y la solicitud de cotizaciones.',
          long: 'Química Danez es una empresa dedicada a la fabricación y comercialización de productos químicos y soluciones de limpieza industrial. Antes del proyecto, la marca no contaba con una plataforma digital que permitiera presentar profesionalmente sus productos y fortalecer su posicionamiento online.\n\nEl objetivo fue diseñar y desarrollar una experiencia digital enfocada en comunicar de manera clara los beneficios y aplicaciones de sus principales productos, incluyendo destapa cañerías, gel limpiamanos y desengrasante industrial. Para lograrlo, se trabajó en una arquitectura de información simple y efectiva que permitiera a los usuarios comprender rápidamente la oferta comercial y acceder fácilmente a canales de contacto.\n\nLa solución se construyó como un catálogo digital optimizado para SEO, rendimiento y dispositivos móviles, priorizando la claridad visual y la facilidad para generar solicitudes de cotización sobre una experiencia de compra tradicional.',
        },

        challenge:
          'La empresa necesitaba posicionarse en internet y presentar sus productos de forma profesional, transmitiendo confianza y facilitando el acceso a información relevante para potenciales clientes. El principal desafío consistía en estructurar un catálogo simple pero efectivo que impulsara el contacto comercial y la generación de cotizaciones.',
        solution:
          'Se diseñó una experiencia digital personalizada centrada en la presentación clara de los productos y en la conversión mediante solicitudes de cotización. La estructura del sitio fue optimizada para destacar cada producto, facilitar la navegación y reforzar la credibilidad de la marca a través de una experiencia moderna y profesional.',

        features: [
          'Catálogo digital de productos',
          'Diseño visual personalizado',
          'Arquitectura de información orientada a conversión',
          'Presentación detallada de productos',
          'Optimización SEO',
          'Experiencia responsive',
          'Navegación simplificada',
          'Generación de solicitudes de cotización',
          'Optimización de rendimiento',
        ],
        responsibilities: [
          'Diseño UI/UX',
          'Arquitectura de información',
          'Diseño visual',
          'Desarrollo frontend',
          'Implementación responsive',
          'Optimización SEO',
          'Optimización de rendimiento',
          'Implementación en WordPress y Elementor',
        ],
        tags: [
          'UI/UX',
          'Frontend',
          'SEO',
          'Diseño responsive',
          'Catálogo web',
          'Generación de leads',
          'Productos industriales',
          'CMS',
        ],

        seo: {
          title: 'Química Danez: catálogo digital de productos',
          description:
            'Catálogo digital de productos para Química Danez: una web clara y optimizada para SEO que presenta su línea de limpieza industrial y facilita cotizar.',
          primaryKeyword: 'catálogo digital de productos',
        },
      },

      en: {
        name: 'Química Danez',
        category: 'Digital Product Catalog',
        industry: 'Chemical Products',
        coverAlt: 'Industrial production plant with the Química Danez logo',

        overview: {
          short:
            'Design and development of a digital platform focused on showcasing Química Danez’s product catalog, strengthening its online presence and facilitating quote requests.',
          medium:
            'Química Danez needed a digital presence capable of presenting its industrial cleaning products while strengthening brand visibility online. The project focused on creating a clear, professional, and conversion-oriented catalog experience.',
          long: 'Química Danez is a company specialized in manufacturing and distributing chemical solutions and industrial cleaning products. Prior to this project, the company lacked a dedicated digital platform to professionally showcase its products and strengthen its online presence.\n\nThe goal was to create a digital experience that clearly communicated the value and applications of its key products, including drain cleaner, hand cleaning gel, and industrial degreaser. A simple yet effective information architecture was designed to help visitors quickly understand the product offering and easily reach the company for inquiries.\n\nThe final solution was developed as a digital catalog optimized for SEO, performance, and mobile devices, prioritizing product visibility and quote generation rather than traditional ecommerce transactions.',
        },

        challenge:
          'The company needed to establish an online presence and present its products in a professional way that would build trust and encourage commercial inquiries. The challenge was creating a simple yet effective catalog capable of driving quote requests and business opportunities.',
        solution:
          'A custom digital experience was designed around product presentation and lead generation. The website structure highlighted each product clearly while simplifying navigation and encouraging visitors to request quotes through strategic calls to action.',

        features: [
          'Digital product catalog',
          'Custom visual design',
          'Conversion-focused information architecture',
          'Detailed product presentation',
          'SEO optimization',
          'Responsive experience',
          'Simplified navigation',
          'Quote request generation',
          'Performance optimization',
        ],
        responsibilities: [
          'UI/UX Design',
          'Information Architecture',
          'Visual Design',
          'Frontend Development',
          'Responsive Implementation',
          'SEO Optimization',
          'Performance Optimization',
          'WordPress and Elementor Development',
        ],
        tags: [
          'UI/UX',
          'Frontend',
          'SEO',
          'Responsive Design',
          'Catalog Website',
          'Lead Generation',
          'Industrial Products',
          'CMS',
        ],

        seo: {
          title: 'Química Danez: Digital Product Catalog Website',
          description:
            'Digital product catalog website for Química Danez: a clear, SEO-optimized site that presents its industrial cleaning line and makes requesting quotes easy.',
          primaryKeyword: 'digital product catalog',
        },
      },
    },
  },

  // ─────────────────────────────────────────── Ingenor
  {
    slug: 'ingenor',
    client: 'Ingenor',
    projectType: 'client',
    status: 'completed',

    country: 'Argentina',
    year: 2026,
    durationWeeks: 3,

    website: 'https://ingenorsa.com.ar/',

    coverImage:
      'https://res.cloudinary.com/dcuocptj7/image/upload/v1780412706/cover-img-ingenor_mbt2oe.webp',
    video:
      'https://res.cloudinary.com/dcuocptj7/video/upload/v1779895477/ingenor_afiu95.mov',

    techStack: ['WordPress', 'Elementor Pro'],

    translations: {
      es: {
        name: 'Ingenor',
        category: 'Sitio web corporativo',
        industry: 'Construcción',
        coverAlt:
          'Obrero de Ingenor trabajando con varillas de acero en una obra',

        overview: {
          short:
            'Diseño y desarrollo de la presencia digital de Ingenor, creando una plataforma enfocada en presentar proyectos constructivos, fortalecer la credibilidad de la empresa y facilitar el contacto con potenciales clientes.',
          medium:
            'Ingenor necesitaba una presencia digital capaz de transmitir confianza, mostrar su experiencia en el sector de la construcción y comunicar de forma clara los servicios que ofrece. El proyecto se centró en crear una experiencia visual profesional orientada a la presentación de proyectos y la generación de oportunidades comerciales.',
          long: 'Ingenor es una empresa constructora especializada en servicios de proyecto, construcción, mantenimiento y reformas de distintos tipos de edificaciones. El principal objetivo del proyecto fue desarrollar una plataforma digital capaz de fortalecer la presencia online de la empresa, transmitir confianza y servir como un canal de captación para nuevos clientes.\n\nLa experiencia fue diseñada para comunicar de forma clara los servicios de la empresa y destacar los proyectos realizados, permitiendo a los visitantes comprender rápidamente la experiencia y capacidad técnica de Ingenor. La arquitectura de información fue organizada para facilitar la navegación y priorizar los elementos más relevantes para potenciales clientes.\n\nUno de los puntos centrales del proyecto fue la sección dedicada a proyectos, donde se implementó un carrusel visual que permite explorar distintas obras acompañadas de información relevante. Esta solución ayudó a reforzar la credibilidad de la empresa mediante la demostración tangible de trabajos ejecutados. Además, el sitio fue optimizado para dispositivos móviles, rendimiento y posicionamiento SEO.',
        },

        challenge:
          'La empresa necesitaba posicionarse en internet y transmitir confianza a potenciales clientes dentro de un sector altamente competitivo. El principal desafío consistía en comunicar la experiencia de la constructora y demostrar su capacidad mediante una presentación clara y visual de sus proyectos y servicios.',
        solution:
          'Se diseñó una experiencia digital personalizada enfocada en la credibilidad y la presentación de proyectos. La plataforma combina una arquitectura de información clara, una navegación intuitiva y una sección visual dedicada a las obras realizadas, permitiendo comunicar la propuesta de valor de la empresa y facilitar el contacto comercial.',

        features: [
          'Diseño visual personalizado',
          'Presentación de proyectos mediante carrusel interactivo',
          'Arquitectura de información orientada a servicios',
          'Sección dedicada a proyectos realizados',
          'Optimización SEO',
          'Experiencia responsive',
          'Navegación orientada a conversión',
          'Generación de solicitudes de contacto',
          'Optimización de rendimiento',
        ],
        responsibilities: [
          'Diseño UI/UX',
          'Arquitectura de información',
          'Desarrollo frontend',
          'Implementación responsive',
          'Optimización SEO',
          'Optimización de rendimiento',
          'Implementación en WordPress y Elementor',
          'Estructuración de contenido',
        ],
        tags: [
          'UI/UX',
          'Frontend',
          'SEO',
          'Diseño responsive',
          'Construcción',
          'Sitio corporativo',
          'Generación de leads',
          'CMS',
        ],

        seo: {
          title: 'Ingenor: diseño web para una constructora',
          description:
            'Diseño web para constructoras: la web de Ingenor muestra sus obras con un carrusel de proyectos, refuerza su credibilidad y genera nuevas consultas comerciales.',
          primaryKeyword: 'diseño web para constructoras',
        },
      },

      en: {
        name: 'Ingenor',
        category: 'Corporate Website',
        industry: 'Construction',
        coverAlt: 'Ingenor worker handling steel rebar on a construction site',

        overview: {
          short:
            'Design and development of Ingenor’s digital presence, creating a platform focused on showcasing construction projects, strengthening credibility, and generating new business opportunities.',
          medium:
            'Ingenor required a digital presence capable of building trust, showcasing its expertise in the construction industry, and clearly communicating its services. The project focused on creating a professional visual experience centered around project presentation and lead generation.',
          long: 'Ingenor is a construction company specialized in project development, construction, maintenance, and renovation services. The primary objective of this project was to create a digital platform capable of strengthening the company’s online presence, reinforcing trust, and serving as a channel for attracting new clients.\n\nThe experience was designed to clearly communicate the company’s services while highlighting completed projects, allowing visitors to quickly understand Ingenor’s expertise and technical capabilities. The information architecture was carefully structured to facilitate navigation and prioritize the most relevant content for prospective clients.\n\nA key component of the project was the projects section, featuring an interactive carousel that showcases completed works alongside relevant project information. This solution helped reinforce credibility by providing tangible examples of the company’s experience. The website was also optimized for mobile devices, performance, and SEO.',
        },

        challenge:
          'The company needed to establish a strong online presence and build trust within a highly competitive industry. The main challenge was communicating experience and expertise while visually demonstrating the quality of completed construction projects.',
        solution:
          'A custom digital experience was designed around credibility and project presentation. The platform combines clear information architecture, intuitive navigation, and a dedicated project showcase section to effectively communicate the company’s value proposition and encourage business inquiries.',

        features: [
          'Custom visual design',
          'Interactive project showcase carousel',
          'Service-oriented information architecture',
          'Dedicated projects section',
          'SEO optimization',
          'Responsive experience',
          'Conversion-focused navigation',
          'Lead generation',
          'Performance optimization',
        ],
        responsibilities: [
          'UI/UX Design',
          'Information Architecture',
          'Frontend Development',
          'Responsive Implementation',
          'SEO Optimization',
          'Performance Optimization',
          'WordPress and Elementor Development',
          'Content Structuring',
        ],
        tags: [
          'UI/UX',
          'Frontend',
          'SEO',
          'Responsive Design',
          'Construction',
          'Corporate Website',
          'Lead Generation',
          'CMS',
        ],

        seo: {
          title: 'Ingenor: Website for a Construction Company',
          description:
            'Construction company website design for Ingenor: a project showcase carousel, a clear service structure, and a site built to earn trust and win new clients.',
          primaryKeyword: 'construction company website design',
        },
      },
    },
  },

  // ─────────────────────────────────────────── Diana Moncada
  {
    slug: 'diana-moncada',
    client: 'Diana Moncada',
    projectType: 'client',
    status: 'in-progress',

    country: 'Colombia',
    year: 2026,
    durationWeeks: 6,

    website: 'https://dianamoncada.com',

    coverImage:
      'https://res.cloudinary.com/dcuocptj7/image/upload/v1790349326/cover-image-diana-moncada_sp6l6u.webp',
    coverPosition: 'top center',
    video:
      'https://res.cloudinary.com/dcuocptj7/video/upload/v1784813255/diana-moncada_rsghqj.mov',

    techStack: ['Astro', 'React', 'GSAP'],

    translations: {
      es: {
        name: 'Diana Moncada',
        category: 'Sitio web y blog',
        industry: 'Psicología',
        coverAlt:
          'La psicóloga Diana Moncada sentada y sonriendo en su consultorio',

        overview: {
          short:
            'Diseño y desarrollo de una plataforma digital para Diana Moncada, enfocada en la presentación de sus servicios profesionales y la creación de una estrategia de contenido basada en un blog optimizado para SEO.',
          medium:
            'El proyecto busca construir la primera presencia digital de Diana Moncada, combinando una plataforma de servicios profesionales con un blog orientado a educar, generar confianza y atraer tráfico orgánico mediante contenido relacionado con distintas áreas de la psicología.',
          long: 'Diana Moncada es una profesional de la psicología que necesitaba construir su primera presencia digital para conectar con personas interesadas en acompañamiento psicológico y bienestar emocional. El objetivo principal fue desarrollar una plataforma capaz de comunicar sus servicios de manera clara, transmitir confianza y facilitar el contacto con potenciales pacientes.\n\nAdemás de la presentación de servicios, el proyecto incorpora una estrategia de contenido basada en un blog desarrollado con Astro. Esta estructura permite crear contenido optimizado para buscadores, mejorar la visibilidad orgánica de la marca personal y posicionar a la profesional como una referencia dentro de su área de especialización.\n\nLa experiencia fue diseñada priorizando claridad, accesibilidad y cercanía, combinando una arquitectura de información enfocada en la experiencia del usuario con una base técnica orientada al rendimiento, SEO y escalabilidad futura.',
        },

        challenge:
          'La profesional no contaba con presencia digital y necesitaba construir confianza desde cero dentro de un sector donde la credibilidad y la conexión humana son fundamentales. Además, era importante diseñar una estructura que permitiera combinar la promoción de servicios con una estrategia de contenido sostenible a largo plazo.',
        solution:
          'Se diseñó una experiencia digital centrada en la comunicación clara de servicios psicológicos y en la generación de confianza mediante contenido educativo. La plataforma integra un blog optimizado para SEO que permite atraer tráfico orgánico mientras facilita el contacto y la solicitud de información por parte de potenciales pacientes.',

        features: [
          'Blog optimizado para SEO',
          'Arquitectura de contenido escalable',
          'Diseño visual personalizado',
          'Experiencia responsive',
          'Optimización de rendimiento con Astro',
          'Navegación orientada a contenido',
          'Presentación de servicios profesionales',
          'Base preparada para crecimiento futuro',
        ],
        responsibilities: [
          'Diseño UI/UX',
          'Arquitectura de información',
          'Diseño visual',
          'Desarrollo frontend',
          'Implementación del blog',
          'Optimización SEO',
          'Optimización de rendimiento',
          'Estrategia de contenido',
        ],
        tags: [
          'UI/UX',
          'SEO',
          'Estrategia de contenido',
          'Blog',
          'Salud mental',
          'Frontend',
          'Rendimiento',
          'Diseño responsive',
        ],

        seo: {
          title: 'Diana Moncada: web y blog para una psicóloga',
          description:
            'Diseño web para psicólogos: la web de Diana Moncada presenta sus servicios con claridad y suma un blog en Astro optimizado para SEO y crecimiento orgánico.',
          primaryKeyword: 'diseño web para psicólogos',
        },
      },

      en: {
        name: 'Diana Moncada',
        category: 'Website and Blog',
        industry: 'Psychology',
        coverAlt: 'Psychologist Diana Moncada seated and smiling in her office',

        overview: {
          short:
            'Design and development of a digital platform for Diana Moncada, focused on showcasing professional services and building an SEO-driven content strategy through a dedicated blog.',
          medium:
            'This project focuses on creating Diana Moncada’s first digital presence by combining professional service presentation with a blog designed to educate, build trust, and attract organic traffic through psychology-related content.',
          long: 'Diana Moncada is a psychology professional who needed a digital platform capable of connecting with individuals seeking psychological support and emotional well-being services. The primary objective was to communicate her services clearly, establish trust, and provide accessible contact channels for potential clients.\n\nBeyond service presentation, the project includes a content strategy built around an Astro-powered blog. This structure enables the creation of SEO-optimized content, strengthens organic visibility, and helps position the professional as a trusted voice within her field.\n\nThe experience was designed with clarity, accessibility, and empathy in mind, combining user-centered information architecture with a technical foundation focused on performance, SEO, and future scalability.',
        },

        challenge:
          'The professional had no previous digital presence and needed to establish trust from the ground up within a field where credibility and human connection are essential. It was also important to create a structure capable of supporting long-term content growth alongside service promotion.',
        solution:
          'A digital experience was designed around clear communication of psychological services and trust-building through educational content. The platform integrates an SEO-optimized blog that supports organic growth while providing intuitive pathways for users to reach out and learn more.',

        features: [
          'SEO-optimized blog',
          'Scalable content architecture',
          'Custom visual design',
          'Responsive experience',
          'Astro-powered performance optimization',
          'Content-focused navigation',
          'Professional service presentation',
          'Foundation for future growth',
        ],
        responsibilities: [
          'UI/UX Design',
          'Information Architecture',
          'Visual Design',
          'Frontend Development',
          'Blog Implementation',
          'SEO Optimization',
          'Performance Optimization',
          'Content Strategy',
        ],
        tags: [
          'UI/UX',
          'SEO',
          'Content Strategy',
          'Blog',
          'Mental Health',
          'Frontend',
          'Performance',
          'Responsive Design',
        ],

        seo: {
          title: 'Diana Moncada: Website & Blog for a Psychologist',
          description:
            "Website design for psychologists: Diana Moncada's site presents her services clearly and adds an Astro blog optimized for SEO and long-term organic growth.",
          primaryKeyword: 'website design for psychologists',
        },
      },
    },
  },
]
