import foodIconSvg from '../assets/food.svg'
import othersIconSvg from '../assets/others.svg'
import servicesIconSvg from '../assets/services.svg'
import transportIconSvg from '../assets/transport.svg'
import accomodationIconSvg from '../assets/accommodation.svg'

export const CATEGORIES = {
  food: {
    name: 'Alimentação',
    icon: foodIconSvg,
  },
  others: {
    name: 'Outros',
    icon: othersIconSvg,
  },
  services: {
    name: 'Serviços',
    icon: servicesIconSvg,
  },
  transport: {
    name: 'Transporte',
    icon: transportIconSvg,
  },
  accomodation: {
    name: 'Hospedagem',
    icon: accomodationIconSvg,
  },
}

export const CATEGORIES_KEYS = Object.keys(CATEGORIES) as Array<
  keyof typeof CATEGORIES
>
