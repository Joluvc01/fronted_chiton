import { faCartShopping, faGopuram, faHome, faIndustry, faList, faNewspaper, faObjectGroup, faScissors, faTruck, faUser } from "@fortawesome/free-solid-svg-icons";

export const navbarData = [
    {
        routeLink: '',
        icon: faHome,
        label: 'Inicio',
        roles: []
    },
    {
        routeLink: 'users',
        icon: faUser,
        label: 'Usuarios',
        roles: ['GERENCIA']
    },
    {
        routeLink: 'customers',
        icon: faIndustry,
        label: 'Clientes',
        roles: ['GERENCIA']
    },
    {
        routeLink: 'categories',
        icon: faList,
        label: 'Categorias',
        roles: ['GERENCIA', 'ALMACEN']
    },
    {
        routeLink: 'products',
        icon: faGopuram,
        label: 'Productos',
        roles: []
    },
    {
        routeLink: 'references',
        icon: faObjectGroup,
        label: 'Referencias',
        roles: ['GERENCIA', 'PRODUCCION', 'DISENIO']
    },
    {
        routeLink: 'purchases',
        icon: faCartShopping,
        label: 'Ordenes de Compra',
        roles: ['GERENCIA', 'ALMACEN']
    },
    {
        routeLink: 'productionOrders',
        icon: faScissors,
        label: 'Ordenes de Produccion',
        roles: ['GERENCIA', 'PRODUCCION']
    },
    {
        routeLink: 'translateOrders',
        icon: faTruck,
        label: 'Traslados',
        roles: ['GERENCIA', 'PRODUCCION']
    },
    {
        routeLink: 'reports',
        icon: faNewspaper,
        label: 'Reportes',
        roles: ['GERENCIA']
    }
]

export function filterNavDataByRole(userRole: string) {
    return navbarData.filter(data => {
        if (!data.roles || data.roles.length === 0) {
            return true;
        }
        return data.roles.includes(userRole); 
    });
    
}
