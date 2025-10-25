export const locales = {
    dashboard: {
        greetings: {
            locator: '#dashboard-actions > h1',
            pt: /Bem-vindo de volta\w+!/,
            en: /Welcome back\w+!/,
            es: /Bienvenido de vuelta\w+!/
        },

        statusDefault: {
            locator: '#dashboard-actions > p:not(:has(span))',
            pt: 'De momento, não estás a editar nenhuma página.',
            en: 'Currently, you are not editing any page.',
            es: 'De momento, no estás editando ninguna página.',
        },

        statusEditing: {
            locator: '#dashboard-actions > p:has(span)',
            pt: /Estás atualmente a editar uma página para a aplicação [^\n]+, com o nome [^\n]+\./,
            en: /You are currently editing a page for the application [^\n]+, with the name [^\n]+./,
            es: /Actualmente estás editando una página para la aplicación [^\n]+, con el nombre [^\n]+\./
        },

        createNew: {
            locator: 'button[data-testid="createNewPage"]',
            pt: 'Criar nova página',
            en: 'Create new page',
            es: 'Crear nueva página'
        },

        leggeraTime: {
            locator: 'div[data-testid="DASHBOARD.SNAPSHOT.TICKS"] > span',
            pt: 'Tempo no LEGGERA',
            en: 'Time on LEGGERA',
            es: 'Tiempo en LEGGERA'
        },

        elements: {
            locator: 'div[data-testid="DASHBOARD.SNAPSHOT.ELEMENTS"] > span',
            pt: 'Nº. de elementos criados',
            en: 'No. of elements created',
            es: 'Nº. de elementos creados'
        },

        pages: {
            locator: 'div[data-testid="DASHBOARD.SNAPSHOT.PAGES"] > span',
            pt: 'N.º de páginas criadas',
            en: 'No. of pages created',
            es: 'N.º de páginas creadas'
        },
    },

    menu: {
        close: {
            locator: '#open-menu-wrapper .menu-toggler > span',
            pt: 'Fechar menu',
            en: 'Close menu',
            es: 'Cerrar menú'
        },
        dashboard: {
            locator: '#open-menu-wrapper div[data-testid="dashboardEntry"] > span ',
            pt: 'Dashboard',
            en: 'Dashboard',
            es: 'Dashboard'
        },
        constructor: {
            locator: '#open-menu-wrapper div[data-testid="constructorEntry"] > span ',
            pt: 'Construtor',
            en: 'Constructor',
            es: 'Constructor'
        },
        wizard: {
            locator: '#open-menu-wrapper div[data-testid="wizardEntry"]  ',
            pt: 'Nova página',
            en: 'New page',
            es: 'Nueva página'
        },
        export: {
            locator: '#open-menu-wrapper div[data-testid="exportEntry"]  ',
            pt: 'Exportar',
            en: 'Export',
            es: 'Exportar'
        },
        editor: {
            locator: '#open-menu-wrapper div[data-testid="editorEntry"]  ',
            pt: 'Editor de código',
            en: 'Code editor',
            es: 'Editor de código'
        },
        pages: {
            locator: '#open-menu-wrapper div[data-testid="cloudEntry"] > span ',
            pt: 'Páginas',
            en: 'Pages',
            es: 'Páginas'
        },
        toolbox: {
            locator: '#open-menu-wrapper div[data-testid="toolboxEntry"] > span ',
            pt: 'Toolbox',
            en: 'Toolbox',
            es: 'Toolbox'
        },
        elements: {
            locator: '#open-menu-wrapper div[data-testid="elementsEntry"]  ',
            pt: 'Elementos',
            en: 'Elements',
            es: 'Elementos'
        },
        applications: {
            locator: '#open-menu-wrapper div[data-testid="applicationsEntry"]  ',
            pt: 'Aplicações',
            en: 'Applications',
            es: 'Aplicaciones'
        },
        collections: {
            locator: '#open-menu-wrapper div[data-testid="collectionsEntry"]  ',
            pt: 'Coleções',
            en: 'Collections',
            es: 'Colecciones'
        },
    },

    wizardResult: {
        sucessLabel: {
            locator: 'lg2-wizard ',
            pt: '',
            en: '',
            es: ''
        },
        restartWizard: {
            locator: 'lg2-wizard ',
            pt: '',
            en: '',
            es: ''
        },
        navigateToEditor: {
            locator: 'lg2-wizard ',
            pt: '',
            en: '',
            es: ''
        }
    },

    wizardDetails: {
        application: {
            locator: 'lg2-wizard ',
            pt: '',
            en: '',
            es: ''
        },
        pageTitle: {
            locator: 'lg2-wizard ',
            pt: '',
            en: '',
            es: ''
        }
    },

    wizardNoCloud: {
        previousStep: {
            locator: 'lg2-wizard ',
            pt: '',
            en: '',
            es: ''
        },
        noCloudRecords: {
            locator: 'lg2-wizard ',
            pt: '',
            en: '',
            es: ''
        }
    },

    wizardCloud: {
        cloudName: {
            locator: 'lg2-wizard ',
            pt: '',
            en: '',
            es: ''
        },

        cloudApp: {
            locator: 'lg2-wizard ',
            pt: '',
            en: '',
            es: ''
        },

        cloudLastEdit: {
            locator: 'lg2-wizard ',
            pt: '',
            en: '',
            es: ''
        },

        cloudFilter: {
            locator: 'lg2-wizard ',
            pt: '',
            en: '',
            es: ''
        }
    },

    wizardMilo: {
        dropZoneLabel: {
            locator: 'lg2-wizard ',
            pt: '',
            en: '',
            es: ''
        }
    },

    wizardOrigin: {
        stepperTitle: {
            locator: 'lg2-wizard',
            pt: '',
            en: '',
            es: ''
        },

        originStep: {
            locator: 'lg2-wizard ',
            pt: '',
            en: '',
            es: ''
        },

        detailsStep: {
            locator: 'lg2-wizard ',
            pt: '',
            en: '',
            es: ''
        },

        resultStep: {
            locator: 'lg2-wizard ',
            pt: '',
            en: '',
            es: ''
        },

        miloStep: {
            locator: 'lg2-wizard ',
            pt: '',
            en: '',
            es: ''
        },

        cloudStep: {
            locator: 'lg2-wizard ',
            pt: '',
            en: '',
            es: ''
        },

        newOption: {
            locator: 'lg2-wizard ',
            pt: '',
            en: '',
            es: ''
        },

        miloOption: {
            locator: 'lg2-wizard ',
            pt: '',
            en: '',
            es: ''
        },

        cloudOption: {
            locator: 'lg2-wizard ',
            pt: '',
            en: '',
            es: ''
        },

        nextStep: {
            locator: 'lg2-wizard ',
            pt: '',
            en: '',
            es: ''
        }
    },

    wizardHeader: {
        en: 'New page',
        pt: ''
    }
}