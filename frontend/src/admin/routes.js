import BandMember from "./views/band_member/BandMember";
import Home from "./Home";
import BandMemberForm from "./views/band_member/BandMemberForm";
import Cities from "./views/cities/Cities";
import Configurations from "./views/configurations/Configurations";
import ConfigurationsForm from "./views/configurations/ConfigurationsForm";
import Contact from "./views/contact/Contact";
import ContactForm from "./views/contact/ContactForm";
import ContactInfo from "./views/contact_info/ContactInfo";
import ContactInfoForm from "./views/contact_info/ContactInfoForm";
import Dashboard from "./views/dashboard/Dashboard";
import Events from "./views/events/Events";
import EventsForm from "./views/events/EventsForm";
import Gallery from "./views/gallery/Gallery";
import GalleryForm from "./views/gallery/GalleryForm";
import Newsletter from "./views/newsletter/Newsletter";
import NewsletterForm from "./views/newsletter/NewsletterForm";
import Pages from "./views/pages/Pages";
import PagesForm from "./views/pages/PagesForm";
import Users from "./views/users/Users";
import UsersForm from "./views/users/UsersForm";

const routes = [
    { path: '/', name: 'Home', element: Home },
    { path: '/dashboard', name: 'Dashboard', element: Dashboard },
    { path: '/users', name: 'Usuários', element: Users },
    { path: '/users-form', name: 'Usuários', element: UsersForm },
    { path: '/cities', name: 'Cidades', element: Cities },
    { path: '/events', name: 'Eventos', element: Events },
    { path: '/events-form', name: 'Eventos', element: EventsForm },
    { path: '/contact-info', name: 'Informação de contato', element: ContactInfo },
    { path: '/contact-info-form', name: 'Informação de contato', element: ContactInfoForm },
    { path: '/gallery', name: 'Galeria', element: Gallery },
    { path: '/gallery-form', name: 'Galeria', element: GalleryForm },
    { path: '/contact', name: 'Contatos', element: Contact },
    { path: '/contact-form', name: 'Contatos', element: ContactForm },
    { path: '/newsletters', name: 'Newsletter', element: Newsletter },
    { path: '/newsletters-form', name: 'Newsletter', element: NewsletterForm },
    { path: '/configurations', name: 'Configurações', element: Configurations },
    { path: '/configurations-form', name: 'Configurações', element: ConfigurationsForm },
    { path: '/pages', name: 'Configurações', element: Pages },
    { path: '/pages-form', name: 'Configurações', element: PagesForm },
    { path: '/bandmember', name: 'Integrante da banda', element: BandMember },
    { path: '/bandmember-form', name: 'Integrante da banda', element: BandMemberForm },
];

export default routes;