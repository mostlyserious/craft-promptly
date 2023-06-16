import { isActive } from './store';
import redactorPlugin from './redactor';
import Modal from './components/Promptly';

import.meta.glob('../{img,font,media}/**/*');

window.Promptly = { Modal, isActive };

redactorPlugin();
