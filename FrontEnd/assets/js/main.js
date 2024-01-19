// Importations des fonctions du module API
import {
  getCategoryInit,
  getWorks,
  modalSendNewWork,
  modalRemoveWork,
  fetchGETApi
} from "./modules/API.js";

// Importations des fonctions du module UI
import {
  AuthStatus,
  displayData,
  nonAdminView,
  adminView,
  displayModalGallery, 
  createModalCloseButton,
  createModalArrow,
  createModalTitle,
  createModalBoxImg,
  createModalTrashIcon,
  createModalLine,
  createModalButton,
} from "./modules/UI.js";

// Importations des fonctions du module Modal
import {
  openModal,
  closeModal,
  stopPropagation,
  modalAddWork,
  createModalPhotoContainer,
  createModalAddPhotoIcon,
  createModalLabelAddPhoto,
  createModalAddPhotoButton,
  createModalImageDisplay,
  createModalTxtFormat,
  createModalLabelTitre,
  createModalInputTitre,
  createModalLabelCategory,
  // createModalInputCategory,
  createModalValidButton,
} from "./modules/Modal.js";

// Importations des fonctions d'aide et de validation
import { activeButtonFilter, updateButtonState } from "./modules/Helper.js";

// initialisation
getCategoryInit();
