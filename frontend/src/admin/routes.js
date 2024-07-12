import Home from "./Home";
import Users from "./views/users/Users";

const routes = [
    { path: '/', name: 'Home', element: Home },
    { path: '/users', name: 'Usuários', element: Users },
    { path: '/cities', name: 'Cidades', element: Home },
    { path: '/events', name: 'Eventos', element: Home },
    { path: '/contact-info', name: 'Informação de contato', element: Home },
    { path: '/gallery', name: 'Galeria', element: Home },
    { path: '/contact', name: 'Contatos', element: Home },
    { path: '/newsletters', name: 'Newsletter', element: Home },
    { path: '/configurations', name: 'Configurações', element: Home },
    { path: '/pages', name: 'Páginas', element: Home },
];

export default routes;