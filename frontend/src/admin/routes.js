import Home from "./Home";
import Cities from "./views/cities/Cities";
import ContactInfo from "./views/contact_info/ContactInfo";
import ContactInfoForm from "./views/contact_info/ContactInfoForm";
import Events from "./views/events/Events";
import EventsForm from "./views/events/EventsForm";
import Gallery from "./views/gallery/Gallery";
import GalleryForm from "./views/gallery/GalleryForm";
import Users from "./views/users/Users";
import UsersForm from "./views/users/UsersForm";

const routes = [
    { path: '/', name: 'Home', element: Home },
    { path: '/users', name: 'Usuários', element: Users },
    { path: '/users-form', name: 'Usuários', element: UsersForm },
    { path: '/cities', name: 'Cidades', element: Cities },
    { path: '/events', name: 'Eventos', element: Events },
    { path: '/events-form', name: 'Eventos', element: EventsForm },
    { path: '/contact-info', name: 'Informação de contato', element: ContactInfo },
    { path: '/contact-info-form', name: 'Informação de contato', element: ContactInfoForm },
    { path: '/gallery', name: 'Galeria', element: Gallery },
    { path: '/gallery-form', name: 'Galeria', element: GalleryForm },
    { path: '/contact', name: 'Contatos', element: Home },
    { path: '/newsletters', name: 'Newsletter', element: Home },
    { path: '/configurations', name: 'Configurações', element: Home },
    { path: '/pages', name: 'Páginas', element: Home },
];

export default routes;