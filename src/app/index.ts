import './styles/tokens.css';
import '../styles/global.css';
import '../styles/header.css';
import '../styles/hero.css';
import '../styles/about.css';
import '../styles/services.css';
import '../styles/portfolio.css';
import '../styles/labs.css';
import '../styles/packs.css';
import '../styles/process.css';
import '../styles/contact.css';
import '../styles/footer.css';
import '../styles/quickfind.css';

import { initUrlState } from './providers/url-state';

document.documentElement.classList.remove('no-js');
initUrlState();
