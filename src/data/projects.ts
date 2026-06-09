import type { Project } from '../types/projects'

export const projects: Project[] = [
  // Diagnostico CIC
  {
    slug: 'diagnostico-cic',
    featured: true,

    client: 'Diagnóstico CIC',

    projectType: 'client',

    status: 'completed',
    country: 'Argentina',

    year: 2026,
    duration: '3 Semanas',

    website: 'https://diagnosticocic.com.ar/',

    coverImage:
      'https://res.cloudinary.com/dcuocptj7/image/upload/v1780336071/cover-img-cic_krc91m.webp',

    thumbnail: '',
    video: '',

    role: ['Frontend Developer', 'UI/UX Designer'],

    techStack: ['WordPress', 'Elementor Pro', 'Figma'],

    tags: ['UI/UX', 'Frontend', 'SEO', 'Responsive Design', 'CMS', 'Branding'],

    translations: {
      es: {
        name: 'Diagnóstico CIC',

        category: 'Sitio Web Corporativo',
        industry: 'Salud',

        overview: {
          short:
            'Rediseño completo de la presencia digital de Diagnóstico CIC, transformando una experiencia single page limitada en una plataforma multipágina moderna, clara y enfocada en la accesibilidad de la información médica.',

          medium:
            'Diagnóstico CIC fue rediseñado para reemplazar una experiencia single page desactualizada por una plataforma multipágina moderna enfocada en mejorar la navegación, la organización de servicios y la accesibilidad para pacientes. El proyecto priorizó una experiencia visual más clara, una arquitectura de contenido escalable y una interacción intuitiva para facilitar la consulta de información médica.',

          long: 'El proyecto de Diagnóstico CIC consistió en la transformación completa de una web single page con problemas de navegación, distribución de contenido y experiencia de usuario. El objetivo principal fue crear una plataforma multipágina moderna que permitiera comunicar de forma clara los servicios médicos ofrecidos por la clínica, mejorando tanto la accesibilidad como la comprensión de la información por parte de los pacientes.\n\nTrabajando en conjunto con el cliente y el diseñador, se definió una nueva arquitectura de contenido orientada a facilitar la navegación y organizar mejor las diferentes áreas y servicios de la clínica. El proyecto incluyó diseño visual personalizado, implementación responsive, optimización SEO y una experiencia dinámica para la sección de consultas, permitiendo alternar fácilmente entre consultas para adultos y jóvenes/niños de manera intuitiva y accesible.',
        },

        challenge: {
          title: 'El reto',
          description:
            'La versión anterior del sitio presentaba una navegación limitada, poca información disponible y una estructura single page que dificultaba el acceso a los diferentes servicios de la clínica. Además del rediseño visual, el principal reto fue reorganizar el contenido y construir una experiencia más clara, moderna y fácil de entender para distintos tipos de pacientes.',
        },

        solution: {
          title: 'La solución',
          description:
            'Se diseñó una nueva experiencia multipágina completamente personalizada enfocada en mejorar la jerarquía visual, la accesibilidad de la información y la navegación general del sitio. La estructura fue pensada para permitir que los usuarios encontraran rápidamente servicios, consultas y contenido relevante mediante una experiencia limpia, moderna y adaptable a cualquier dispositivo.',
        },

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

        seo: {
          title: 'Diagnóstico CIC | Rediseño UX/UI y Desarrollo Web',
          description:
            'Rediseño completo de la experiencia digital de Diagnóstico CIC, transformando una web single page en una plataforma multipágina moderna, accesible y optimizada para pacientes.',
          keywords: [
            'Diagnóstico CIC',
            'Diseño UX',
            'Diseño UI',
            'WordPress',
            'Elementor',
            'Desarrollo Web',
            'SEO',
            'Healthcare Website',
            'Responsive Design',
            'Frontend Development',
          ],
        },
      },

      en: {
        name: 'Diagnóstico CIC',

        category: 'Corporate Website',
        industry: 'Healthcare',

        overview: {
          short:
            'A complete redesign of Diagnóstico CIC’s digital presence, transforming a limited single-page experience into a modern multi-page platform focused on clarity, accessibility, and patient trust.',

          medium:
            'Diagnóstico CIC was redesigned to replace an outdated single-page website with a modern multi-page platform focused on improving navigation, service discovery, and information accessibility for patients. The project emphasized a cleaner visual experience, scalable content architecture, and intuitive interactions that make healthcare information easier to explore and understand.',

          long: 'The Diagnóstico CIC project involved the complete transformation of an outdated single-page website that suffered from navigation limitations, insufficient information structure, and a poor user experience. The primary goal was to create a modern multi-page platform capable of communicating the clinic’s medical services more effectively while improving accessibility and information clarity for patients.\n\nWorking closely with both the client and the design team, a new content architecture was defined to organize services more efficiently and create a smoother navigation experience. The project included custom visual design, responsive implementation, SEO optimization, and a dynamic consultation experience that allows users to seamlessly switch between adult and pediatric consultation categories through a clear and intuitive interface.',
        },

        challenge: {
          title: 'The Challenge',
          description:
            'The previous website provided limited navigation, insufficient service information, and a single-page structure that made it difficult for users to access relevant healthcare content. Beyond the visual redesign, the main challenge was reorganizing information into a more intuitive, accessible, and patient-friendly experience.',
        },

        solution: {
          title: 'The Solution',
          description:
            'A fully customized multi-page experience was designed to improve visual hierarchy, information accessibility, and overall navigation. The new structure was crafted to help users quickly discover services, consultations, and relevant content through a clean, modern, and responsive experience across all devices.',
        },

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
          'Frontend implementation and development',
          'Creative and UX collaboration',
          'Responsive development',
          'SEO optimization',
          'Form integration',
          'Content structuring',
          'WordPress and Elementor implementation',
        ],

        seo: {
          title: 'Diagnóstico CIC | UX/UI Redesign and Web Development',
          description:
            "Complete redesign of Diagnóstico CIC's digital experience, transforming a single-page website into a modern, accessible, and patient-focused multi-page platform.",
          keywords: [
            'Diagnóstico CIC',
            'UX Design',
            'UI Design',
            'WordPress',
            'Elementor',
            'Web Development',
            'SEO',
            'Healthcare Website',
            'Responsive Design',
            'Frontend Development',
          ],
        },
      },
    },
  },

  // Pacific Waves Hostel & Surf
  {
    slug: 'pacific-waves-hostel-and-surf',
    featured: true,

    client: 'Pacific Waves Hostel & Surf',

    projectType: 'client',

    status: 'completed',
    country: 'Colombia',

    year: 2025,
    duration: '3 semanas',

    role: ['Fullstack Developer', 'UI/UX Designer'],

    website: 'https://pacificwaveshostel.com/',

    coverImage:
      'https://res.cloudinary.com/dcuocptj7/image/upload/v1747193717/pacific-waves-hostel-4_j9vi8e.webp',
    thumbnail: '',

    techStack: ['Astro', 'React', 'GSAP', 'Figma', 'Cloudbeds'],

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

    translations: {
      es: {
        name: 'Pacific Waves Hostel & Surf',

        category: 'Sitio Web Corporativo',
        industry: 'Turismo',

        overview: {
          short:
            'Diseño y desarrollo de la primera presencia digital de Pacific Waves Hostel & Surf, creando una experiencia enfocada en generar confianza, destacar sus experiencias turísticas y facilitar el proceso de reserva.',

          medium:
            'Pacific Waves Hostel & Surf necesitaba una presencia digital capaz de transmitir la esencia de El Valle, Bahía Solano y convertir visitantes en huéspedes. El proyecto combinó diseño visual, experiencia de usuario y una estructura orientada a reservas para presentar de forma clara alojamientos, experiencias de surf, avistamiento de ballenas y rutas ecológicas.',

          long: 'Pacific Waves Hostel & Surf nació con la necesidad de construir su primera presencia digital y ofrecer una plataforma capaz de transmitir la experiencia única que brinda a sus visitantes en El Valle, Bahía Solano, Chocó. El objetivo principal era generar confianza, presentar sus servicios de manera atractiva y facilitar el acceso al proceso de reserva.\n\nEl proyecto fue diseñado desde cero, combinando una identidad visual inspirada en la naturaleza, el surf y la tranquilidad del entorno. Se trabajó cuidadosamente la arquitectura de contenido para destacar alojamientos, planes turísticos, clases de surf, avistamiento de ballenas y experiencias ecológicas, guiando al usuario hacia la reserva mediante una navegación intuitiva y llamadas a la acción estratégicamente ubicadas.\n\nAdemás, se incorporaron microinteracciones y animaciones de desplazamiento para enriquecer la experiencia sin afectar la usabilidad, mientras que las integraciones con Cloudbeds permitieron conectar los diferentes puntos de reserva dentro del recorrido del usuario.',
        },

        challenge: {
          title: 'El reto',
          description:
            'Crear la primera presencia digital de la marca implicaba construir credibilidad desde cero y transformar una experiencia turística física en una experiencia digital atractiva. El desafío consistía en comunicar múltiples servicios y actividades sin generar fricción, manteniendo siempre visible el camino hacia la reserva.',
        },

        solution: {
          title: 'La solución',
          description:
            'Se diseñó una experiencia digital enfocada en la exploración y la conversión, priorizando el contenido visual, la claridad de los planes disponibles y un flujo de navegación orientado a reservas. La estructura del sitio fue construida para transmitir confianza, facilitar la comprensión de los servicios y conectar al usuario con la plataforma de reservas mediante puntos estratégicos de interacción.',
        },

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

        seo: {
          title: 'Pacific Waves Hostel & Surf | Diseño UX/UI y Desarrollo Web',
          description:
            'Diseño y desarrollo de la primera presencia digital de Pacific Waves Hostel & Surf, creando una experiencia orientada a reservas, confianza y exploración de experiencias turísticas.',
          keywords: [
            'Pacific Waves Hostel',
            'Surf Hostel',
            'Diseño UX',
            'Diseño UI',
            'Astro',
            'React',
            'GSAP',
            'Cloudbeds',
            'Turismo',
            'Booking Experience',
            'Responsive Design',
            'Frontend Development',
          ],
        },
      },

      en: {
        name: 'Pacific Waves Hostel & Surf',

        category: 'Corporate Website',
        industry: 'Tourism',

        overview: {
          short:
            'Design and development of Pacific Waves Hostel & Surf’s first digital presence, creating an experience focused on building trust, showcasing travel experiences, and simplifying the booking journey.',

          medium:
            'Pacific Waves Hostel & Surf needed a digital presence capable of capturing the essence of El Valle, Bahía Solano while converting visitors into guests. The project combined visual design, user experience, and a booking-oriented structure to showcase accommodations, surf experiences, whale watching, and eco-tourism activities.',

          long: 'Pacific Waves Hostel & Surf required its first digital platform to communicate the unique experience it offers visitors in El Valle, Bahía Solano, Chocó. The primary goal was to build trust, present services in an engaging way, and provide a seamless path toward reservations.\n\nThe project was designed from the ground up, combining a visual identity inspired by nature, surfing, and the tranquility of the Pacific coast. Content architecture was carefully crafted to highlight accommodations, travel packages, surf lessons, whale watching, and eco-tourism experiences, guiding visitors toward booking actions through intuitive navigation and strategically placed calls to action.\n\nTo enrich the experience, subtle microinteractions and scroll-based animations were implemented, while Cloudbeds integrations connected users to reservation flows throughout the site journey.',
        },

        challenge: {
          title: 'The Challenge',
          description:
            'Building the brand’s first digital presence meant establishing credibility from scratch and translating a real-world tourism experience into an engaging online journey. The challenge was to communicate multiple services and activities while keeping the booking path simple and visible.',
        },

        solution: {
          title: 'The Solution',
          description:
            'A conversion-focused digital experience was designed around exploration, storytelling, and booking accessibility. The website structure prioritized visual content, clear presentation of travel packages, and strategic interactions that guide users toward reservations while reinforcing trust in the brand.',
        },

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

        seo: {
          title:
            'Pacific Waves Hostel & Surf | UX/UI Design and Web Development',
          description:
            "Design and development of Pacific Waves Hostel & Surf's first digital presence, focused on bookings, trust, and showcasing tourism experiences.",
          keywords: [
            'Pacific Waves Hostel',
            'Surf Hostel',
            'UX Design',
            'UI Design',
            'Astro',
            'React',
            'GSAP',
            'Cloudbeds',
            'Tourism',
            'Booking Experience',
            'Responsive Design',
            'Frontend Development',
          ],
        },
      },
    },
  },

  // MindSett
  {
    slug: 'mindsett',
    featured: true,

    client: 'MindSett',

    projectType: 'client',

    status: 'completed',
    country: 'Argentina',

    year: 2026,
    duration: '2 Semanas',

    website: 'https://mindsett.com.ar/',

    coverImage:
      'https://res.cloudinary.com/dcuocptj7/image/upload/v1780413806/cover-img-mindsett_g7rxzl.webp',
    thumbnail: '',
    video: '',

    role: ['Fullstack Developer', 'UI/UX Designer'],

    techStack: ['WordPress', 'Elementor Pro'],

    tags: [
      'UI/UX',
      'Frontend',
      'SEO',
      'Responsive Design',
      'Lead Generation',
      'Marketing',
      'Branding',
      'CMS',
    ],

    translations: {
      es: {
        name: 'MindSett',

        category: 'Sitio Web Corporativo',
        industry: 'Marketing Digital',

        overview: {
          short:
            'Diseño y desarrollo de la primera presencia digital de MindSett, creando una plataforma enfocada en comunicar sus servicios, fortalecer la credibilidad de la marca y generar nuevas oportunidades comerciales.',

          medium:
            'MindSett necesitaba una presencia digital capaz de representar profesionalmente su oferta de servicios y servir como un canal de captación más allá de las redes sociales. El proyecto se enfocó en organizar una amplia variedad de servicios relacionados con marketing, branding y desarrollo digital mediante una experiencia clara, moderna y orientada a la conversión.',

          long: 'MindSett es una agencia digital de Argentina que ofrecía múltiples servicios relacionados con marketing, branding, diseño y desarrollo, pero cuya presencia online dependía principalmente de redes sociales. El objetivo del proyecto fue construir su primera plataforma digital propia para fortalecer la credibilidad de la marca, comunicar claramente su propuesta de valor y generar nuevas oportunidades comerciales.\n\nSe trabajó en la definición de una arquitectura de información capaz de organizar una amplia oferta de servicios de forma intuitiva y comprensible para potenciales clientes. El diseño visual fue desarrollado a medida con un enfoque en profesionalismo, creatividad, innovación y confianza, alineando la experiencia digital con el posicionamiento de la marca.\n\nLa estructura del sitio fue pensada para guiar a los usuarios hacia acciones de conversión mediante formularios de solicitud de cotización y puntos estratégicos de contacto por WhatsApp. Además, se optimizó la experiencia responsive, el rendimiento y el SEO para maximizar la visibilidad y accesibilidad del proyecto.',
        },

        challenge: {
          title: 'El reto',
          description:
            'La agencia ofrecía una amplia variedad de servicios, pero dependía principalmente de redes sociales para comunicarlos. El principal desafío fue organizar esta oferta de manera clara y estructurada, evitando la sobrecarga de información y facilitando que los usuarios comprendieran rápidamente el valor de cada servicio.',
        },

        solution: {
          title: 'La solución',
          description:
            'Se diseñó una experiencia digital completamente personalizada enfocada en la claridad de la información, la credibilidad de la marca y la generación de oportunidades comerciales. La arquitectura del sitio permitió presentar los servicios de forma organizada, mientras que los formularios y llamados a la acción estratégicos facilitaron el contacto y la solicitud de cotizaciones.',
        },

        features: [
          'Diseño visual completamente personalizado',
          'Arquitectura de información orientada a servicios',
          'Formulario de solicitud de cotizaciones',
          'Integración de contacto mediante WhatsApp',
          'Presentación estructurada de múltiples servicios',
          'Optimización SEO',
          'Experiencia responsive',
          'Animaciones e interacciones sutiles',
          'Navegación orientada a conversión',
        ],

        responsibilities: [
          'Diseño UI/UX',
          'Arquitectura de información',
          'Diseño visual',
          'Desarrollo frontend',
          'Desarrollo fullstack',
          'Implementación responsive',
          'Optimización SEO',
          'Implementación en WordPress y Elementor',
          'Diseño de flujos de conversión',
        ],

        seo: {
          title: 'MindSett | Diseño UX/UI y Desarrollo Web Corporativo',
          description:
            'Diseño y desarrollo de la primera presencia digital de MindSett, creando una plataforma orientada a la comunicación de servicios, generación de leads y fortalecimiento de marca.',
          keywords: [
            'MindSett',
            'Marketing Digital',
            'Diseño UX',
            'Diseño UI',
            'WordPress',
            'Elementor',
            'Lead Generation',
            'Branding',
            'SEO',
            'Responsive Design',
            'Frontend Development',
          ],
        },
      },

      en: {
        name: 'MindSett',

        category: 'Corporate Website',
        industry: 'Digital Marketing',

        overview: {
          short:
            'Design and development of MindSett’s first digital presence, creating a platform focused on communicating its services, strengthening brand credibility, and generating new business opportunities.',

          medium:
            'MindSett needed a professional digital presence capable of representing its service offering and serving as a lead-generation channel beyond social media. The project focused on organizing a broad range of marketing, branding, and digital services into a clear, modern, and conversion-oriented experience.',

          long: 'MindSett is a digital agency based in Argentina offering services across marketing, branding, design, and development. Prior to the project, its online presence relied primarily on social media channels. The goal was to create its first dedicated digital platform to strengthen brand credibility, clearly communicate its value proposition, and support business growth.\n\nA key focus of the project was designing an information architecture capable of organizing a diverse service offering in a way that was intuitive and easy for potential clients to understand. The visual design was crafted around professionalism, creativity, innovation, and trust, ensuring alignment between the brand identity and the user experience.\n\nThe website structure was designed to guide visitors toward conversion through quote request forms and strategically placed WhatsApp contact points. Responsive optimization, performance improvements, and SEO best practices were also implemented to maximize visibility and accessibility.',
        },

        challenge: {
          title: 'The Challenge',
          description:
            'The agency offered a wide range of services but relied primarily on social media to communicate them. The main challenge was structuring and presenting this information clearly, helping potential clients quickly understand the value of each service without overwhelming them.',
        },

        solution: {
          title: 'The Solution',
          description:
            'A fully custom digital experience was designed around clarity, credibility, and lead generation. The website architecture organized services into a structured and accessible format, while strategic calls to action, quote request forms, and WhatsApp contact points streamlined the conversion process.',
        },

        features: [
          'Custom visual design',
          'Service-oriented information architecture',
          'Quote request form',
          'WhatsApp contact integration',
          'Structured presentation of multiple services',
          'SEO optimization',
          'Responsive experience',
          'Subtle animations and interactions',
          'Conversion-focused navigation',
        ],

        responsibilities: [
          'UI/UX Design',
          'Information Architecture',
          'Visual Design',
          'Frontend Development',
          'Fullstack Development',
          'Responsive Implementation',
          'SEO Optimization',
          'WordPress and Elementor Development',
          'Conversion Flow Design',
        ],

        seo: {
          title: 'MindSett | UX/UI Design and Corporate Website Development',
          description:
            'Design and development of MindSett’s first digital presence, focused on service communication, lead generation, and brand positioning.',
          keywords: [
            'MindSett',
            'Digital Marketing',
            'UX Design',
            'UI Design',
            'WordPress',
            'Elementor',
            'Lead Generation',
            'Branding',
            'SEO',
            'Responsive Design',
            'Frontend Development',
          ],
        },
      },
    },
  },

  // Quimica Danez
  {
    slug: 'quimica-danez',
    featured: true,

    client: 'Química Danez',

    projectType: 'client',

    status: 'completed',
    country: 'Argentina',

    year: 2026,
    duration: '3 Semanas',

    website: 'https://quimicadanez.com/',

    coverImage:
      'https://res.cloudinary.com/dcuocptj7/image/upload/v1780413086/conver-img-quimica-danez_nktp1s.webp',
    thumbnail: '',
    video: '',

    role: ['Frontend Developer', 'UI/UX Designer', 'Information Architect'],

    techStack: ['WordPress', 'Elementor Pro'],

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

    translations: {
      es: {
        name: 'Química Danez',

        category: 'Catálogo Digital',
        industry: 'Productos Químicos',

        overview: {
          short:
            'Diseño y desarrollo de una plataforma digital orientada a presentar el catálogo de productos de Química Danez, fortaleciendo su presencia online y facilitando la generación de cotizaciones.',

          medium:
            'Química Danez necesitaba una presencia digital capaz de comunicar sus productos de limpieza industrial y posicionar la marca en internet. El proyecto se enfocó en crear un catálogo digital claro, profesional y optimizado para facilitar la consulta de productos y la solicitud de cotizaciones.',

          long: 'Química Danez es una empresa dedicada a la fabricación y comercialización de productos químicos y soluciones de limpieza industrial. Antes del proyecto, la marca no contaba con una plataforma digital que permitiera presentar profesionalmente sus productos y fortalecer su posicionamiento online.\n\nEl objetivo fue diseñar y desarrollar una experiencia digital enfocada en comunicar de manera clara los beneficios y aplicaciones de sus principales productos, incluyendo destapa cañerías, gel limpiamanos y desengrasante industrial. Para lograrlo, se trabajó en una arquitectura de información simple y efectiva que permitiera a los usuarios comprender rápidamente la oferta comercial y acceder fácilmente a canales de contacto.\n\nLa solución se construyó como un catálogo digital optimizado para SEO, rendimiento y dispositivos móviles, priorizando la claridad visual y la facilidad para generar solicitudes de cotización sobre una experiencia de compra tradicional.',
        },

        challenge: {
          title: 'El reto',
          description:
            'La empresa necesitaba posicionarse en internet y presentar sus productos de forma profesional, transmitiendo confianza y facilitando el acceso a información relevante para potenciales clientes. El principal desafío consistía en estructurar un catálogo simple pero efectivo que impulsara el contacto comercial y la generación de cotizaciones.',
        },

        solution: {
          title: 'La solución',
          description:
            'Se diseñó una experiencia digital personalizada centrada en la presentación clara de los productos y en la conversión mediante solicitudes de cotización. La estructura del sitio fue optimizada para destacar cada producto, facilitar la navegación y reforzar la credibilidad de la marca a través de una experiencia moderna y profesional.',
        },

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

        seo: {
          title:
            'Química Danez | Catálogo Digital y Desarrollo Web Corporativo',
          description:
            'Diseño y desarrollo de un catálogo digital para Química Danez, enfocado en la presentación de productos químicos industriales y la generación de cotizaciones.',
          keywords: [
            'Química Danez',
            'Productos Químicos',
            'Limpieza Industrial',
            'Catálogo Digital',
            'Diseño UX',
            'Diseño UI',
            'WordPress',
            'Elementor',
            'SEO',
            'Lead Generation',
            'Responsive Design',
          ],
        },
      },

      en: {
        name: 'Química Danez',

        category: 'Digital Product Catalog',
        industry: 'Chemical Products',

        overview: {
          short:
            'Design and development of a digital platform focused on showcasing Química Danez’s product catalog, strengthening its online presence and facilitating quote requests.',

          medium:
            'Química Danez needed a digital presence capable of presenting its industrial cleaning products while strengthening brand visibility online. The project focused on creating a clear, professional, and conversion-oriented catalog experience.',

          long: 'Química Danez is a company specialized in manufacturing and distributing chemical solutions and industrial cleaning products. Prior to this project, the company lacked a dedicated digital platform to professionally showcase its products and strengthen its online presence.\n\nThe goal was to create a digital experience that clearly communicated the value and applications of its key products, including drain cleaner, hand cleaning gel, and industrial degreaser. A simple yet effective information architecture was designed to help visitors quickly understand the product offering and easily reach the company for inquiries.\n\nThe final solution was developed as a digital catalog optimized for SEO, performance, and mobile devices, prioritizing product visibility and quote generation rather than traditional ecommerce transactions.',
        },

        challenge: {
          title: 'The Challenge',
          description:
            'The company needed to establish an online presence and present its products in a professional way that would build trust and encourage commercial inquiries. The challenge was creating a simple yet effective catalog capable of driving quote requests and business opportunities.',
        },

        solution: {
          title: 'The Solution',
          description:
            'A custom digital experience was designed around product presentation and lead generation. The website structure highlighted each product clearly while simplifying navigation and encouraging visitors to request quotes through strategic calls to action.',
        },

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

        seo: {
          title:
            'Química Danez | Digital Product Catalog and Corporate Web Development',
          description:
            'Design and development of a digital catalog for Química Danez, focused on industrial cleaning products, brand positioning, and quote generation.',
          keywords: [
            'Química Danez',
            'Chemical Products',
            'Industrial Cleaning',
            'Digital Catalog',
            'UX Design',
            'UI Design',
            'WordPress',
            'Elementor',
            'SEO',
            'Lead Generation',
            'Responsive Design',
          ],
        },
      },
    },
  },

  // Ingenor
  {
    slug: 'ingenor',
    featured: true,

    client: 'Ingenor',

    projectType: 'client',

    status: 'completed',
    country: 'Argentina',

    year: 2026,
    duration: '3 Semanas',

    website: 'https://ingenorsa.com.ar/',

    coverImage:
      'https://res.cloudinary.com/dcuocptj7/image/upload/v1780412706/cover-img-ingenor_mbt2oe.webp',
    thumbnail: '',
    video: '',

    role: ['Frontend Developer', 'UI/UX Designer', 'Information Architect'],

    techStack: ['WordPress', 'Elementor Pro'],

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

    translations: {
      es: {
        name: 'Ingenor',

        category: 'Sitio Web Corporativo',
        industry: 'Construcción',

        overview: {
          short:
            'Diseño y desarrollo de la presencia digital de Ingenor, creando una plataforma enfocada en presentar proyectos constructivos, fortalecer la credibilidad de la empresa y facilitar el contacto con potenciales clientes.',

          medium:
            'Ingenor necesitaba una presencia digital capaz de transmitir confianza, mostrar su experiencia en el sector de la construcción y comunicar de forma clara los servicios que ofrece. El proyecto se centró en crear una experiencia visual profesional orientada a la presentación de proyectos y la generación de oportunidades comerciales.',

          long: 'Ingenor es una empresa constructora especializada en servicios de proyecto, construcción, mantenimiento y reformas de distintos tipos de edificaciones. El principal objetivo del proyecto fue desarrollar una plataforma digital capaz de fortalecer la presencia online de la empresa, transmitir confianza y servir como un canal de captación para nuevos clientes.\n\nLa experiencia fue diseñada para comunicar de forma clara los servicios de la empresa y destacar los proyectos realizados, permitiendo a los visitantes comprender rápidamente la experiencia y capacidad técnica de Ingenor. La arquitectura de información fue organizada para facilitar la navegación y priorizar los elementos más relevantes para potenciales clientes.\n\nUno de los puntos centrales del proyecto fue la sección dedicada a proyectos, donde se implementó un carrusel visual que permite explorar distintas obras acompañadas de información relevante. Esta solución ayudó a reforzar la credibilidad de la empresa mediante la demostración tangible de trabajos ejecutados. Además, el sitio fue optimizado para dispositivos móviles, rendimiento y posicionamiento SEO.',
        },

        challenge: {
          title: 'El reto',
          description:
            'La empresa necesitaba posicionarse en internet y transmitir confianza a potenciales clientes dentro de un sector altamente competitivo. El principal desafío consistía en comunicar la experiencia de la constructora y demostrar su capacidad mediante una presentación clara y visual de sus proyectos y servicios.',
        },

        solution: {
          title: 'La solución',
          description:
            'Se diseñó una experiencia digital personalizada enfocada en la credibilidad y la presentación de proyectos. La plataforma combina una arquitectura de información clara, una navegación intuitiva y una sección visual dedicada a las obras realizadas, permitiendo comunicar la propuesta de valor de la empresa y facilitar el contacto comercial.',
        },

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

        seo: {
          title:
            'Ingenor | Diseño UX/UI y Desarrollo Web para Empresa Constructora',
          description:
            'Diseño y desarrollo de la presencia digital de Ingenor, enfocada en mostrar proyectos constructivos, fortalecer la credibilidad de la empresa y generar nuevas oportunidades comerciales.',
          keywords: [
            'Ingenor',
            'Constructora',
            'Construcción',
            'Diseño UX',
            'Diseño UI',
            'WordPress',
            'Elementor',
            'Corporate Website',
            'Lead Generation',
            'SEO',
            'Responsive Design',
          ],
        },
      },

      en: {
        name: 'Ingenor',

        category: 'Corporate Website',
        industry: 'Construction',

        overview: {
          short:
            'Design and development of Ingenor’s digital presence, creating a platform focused on showcasing construction projects, strengthening credibility, and generating new business opportunities.',

          medium:
            'Ingenor required a digital presence capable of building trust, showcasing its expertise in the construction industry, and clearly communicating its services. The project focused on creating a professional visual experience centered around project presentation and lead generation.',

          long: 'Ingenor is a construction company specialized in project development, construction, maintenance, and renovation services. The primary objective of this project was to create a digital platform capable of strengthening the company’s online presence, reinforcing trust, and serving as a channel for attracting new clients.\n\nThe experience was designed to clearly communicate the company’s services while highlighting completed projects, allowing visitors to quickly understand Ingenor’s expertise and technical capabilities. The information architecture was carefully structured to facilitate navigation and prioritize the most relevant content for prospective clients.\n\nA key component of the project was the projects section, featuring an interactive carousel that showcases completed works alongside relevant project information. This solution helped reinforce credibility by providing tangible examples of the company’s experience. The website was also optimized for mobile devices, performance, and SEO.',
        },

        challenge: {
          title: 'The Challenge',
          description:
            'The company needed to establish a strong online presence and build trust within a highly competitive industry. The main challenge was communicating experience and expertise while visually demonstrating the quality of completed construction projects.',
        },

        solution: {
          title: 'The Solution',
          description:
            'A custom digital experience was designed around credibility and project presentation. The platform combines clear information architecture, intuitive navigation, and a dedicated project showcase section to effectively communicate the company’s value proposition and encourage business inquiries.',
        },

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

        seo: {
          title:
            'Ingenor | UX/UI Design and Web Development for Construction Companies',
          description:
            'Design and development of Ingenor’s digital presence, focused on showcasing construction projects, building trust, and generating new business opportunities.',
          keywords: [
            'Ingenor',
            'Construction Company',
            'Construction',
            'UX Design',
            'UI Design',
            'WordPress',
            'Elementor',
            'Corporate Website',
            'Lead Generation',
            'SEO',
            'Responsive Design',
          ],
        },
      },
    },
  },

  // Diana Moncada
  {
    slug: 'diana-moncada',
    featured: true,

    client: 'Diana Moncada',

    projectType: 'client',

    status: 'in-progress',
    country: 'Colombia',

    year: 2026,
    duration: '6 Semanas',

    website: 'https://dianamoncada.com',

    coverImage: '',
    thumbnail: '',
    video: '',

    role: ['Frontend Developer', 'UI/UX Designer', 'Information Architect'],

    techStack: ['Astro', 'React', 'GSAP'],

    tags: [
      'UI/UX',
      'SEO',
      'Content Strategy',
      'Blog',
      'Healthcare',
      'Frontend',
      'Performance',
      'Responsive Design',
    ],

    translations: {
      es: {
        name: 'Diana Moncada',

        category: 'Sitio Web y Blog',
        industry: 'Psicología',

        overview: {
          short:
            'Diseño y desarrollo de una plataforma digital para Diana Moncada, enfocada en la presentación de sus servicios profesionales y la creación de una estrategia de contenido basada en un blog optimizado para SEO.',

          medium:
            'El proyecto busca construir la primera presencia digital de Diana Moncada, combinando una plataforma de servicios profesionales con un blog orientado a educar, generar confianza y atraer tráfico orgánico mediante contenido relacionado con distintas áreas de la psicología.',

          long: 'Diana Moncada es una profesional de la psicología que necesitaba construir su primera presencia digital para conectar con personas interesadas en acompañamiento psicológico y bienestar emocional. El objetivo principal fue desarrollar una plataforma capaz de comunicar sus servicios de manera clara, transmitir confianza y facilitar el contacto con potenciales pacientes.\n\nAdemás de la presentación de servicios, el proyecto incorpora una estrategia de contenido basada en un blog desarrollado con Astro. Esta estructura permite crear contenido optimizado para buscadores, mejorar la visibilidad orgánica de la marca personal y posicionar a la profesional como una referencia dentro de su área de especialización.\n\nLa experiencia fue diseñada priorizando claridad, accesibilidad y cercanía, combinando una arquitectura de información enfocada en la experiencia del usuario con una base técnica orientada al rendimiento, SEO y escalabilidad futura.',
        },

        challenge: {
          title: 'El reto',
          description:
            'La profesional no contaba con presencia digital y necesitaba construir confianza desde cero dentro de un sector donde la credibilidad y la conexión humana son fundamentales. Además, era importante diseñar una estructura que permitiera combinar la promoción de servicios con una estrategia de contenido sostenible a largo plazo.',
        },

        solution: {
          title: 'La solución',
          description:
            'Se diseñó una experiencia digital centrada en la comunicación clara de servicios psicológicos y en la generación de confianza mediante contenido educativo. La plataforma integra un blog optimizado para SEO que permite atraer tráfico orgánico mientras facilita el contacto y la solicitud de información por parte de potenciales pacientes.',
        },

        features: [
          'Blog optimizado para SEO',
          'Arquitectura de contenido escalable',
          'Diseño visual personalizado',
          'Experiencia responsive',
          'Optimización de rendimiento con Astro',
          'Navegación orientada a contenido',
          'Presentación de servicios profesionales',
          'Optimización para buscadores',
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

        seo: {
          title:
            'Diana Moncada | Diseño Web, Blog y Estrategia SEO para Psicología',
          description:
            'Diseño y desarrollo de una plataforma digital para servicios de psicología, incorporando un blog optimizado para SEO y una estrategia de contenido orientada al crecimiento orgánico.',
          keywords: [
            'Diana Moncada',
            'Psicología',
            'Blog',
            'SEO',
            'Astro',
            'React',
            'UX Design',
            'UI Design',
            'Content Strategy',
            'Frontend Development',
            'Performance',
          ],
        },
      },

      en: {
        name: 'Diana Moncada',

        category: 'Website and Blog',
        industry: 'Psychology',

        overview: {
          short:
            'Design and development of a digital platform for Diana Moncada, focused on showcasing professional services and building an SEO-driven content strategy through a dedicated blog.',

          medium:
            'This project focuses on creating Diana Moncada’s first digital presence by combining professional service presentation with a blog designed to educate, build trust, and attract organic traffic through psychology-related content.',

          long: 'Diana Moncada is a psychology professional who needed a digital platform capable of connecting with individuals seeking psychological support and emotional well-being services. The primary objective was to communicate her services clearly, establish trust, and provide accessible contact channels for potential clients.\n\nBeyond service presentation, the project includes a content strategy built around an Astro-powered blog. This structure enables the creation of SEO-optimized content, strengthens organic visibility, and helps position the professional as a trusted voice within her field.\n\nThe experience was designed with clarity, accessibility, and empathy in mind, combining user-centered information architecture with a technical foundation focused on performance, SEO, and future scalability.',
        },

        challenge: {
          title: 'The Challenge',
          description:
            'The professional had no previous digital presence and needed to establish trust from the ground up within a field where credibility and human connection are essential. It was also important to create a structure capable of supporting long-term content growth alongside service promotion.',
        },

        solution: {
          title: 'The Solution',
          description:
            'A digital experience was designed around clear communication of psychological services and trust-building through educational content. The platform integrates an SEO-optimized blog that supports organic growth while providing intuitive pathways for users to reach out and learn more.',
        },

        features: [
          'SEO-optimized blog',
          'Scalable content architecture',
          'Custom visual design',
          'Responsive experience',
          'Astro-powered performance optimization',
          'Content-focused navigation',
          'Professional service presentation',
          'Search engine optimization',
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

        seo: {
          title:
            'Diana Moncada | Website, Blog and SEO Strategy for Psychology Services',
          description:
            'Design and development of a digital platform for psychology services, featuring an SEO-focused blog and a content strategy designed for organic growth.',
          keywords: [
            'Diana Moncada',
            'Psychology',
            'Blog',
            'SEO',
            'Astro',
            'React',
            'UX Design',
            'UI Design',
            'Content Strategy',
            'Frontend Development',
            'Performance',
          ],
        },
      },
    },
  },
]
