import logo from "./logo.png";
import seahrc from "./seahrc.png";
import nav_cart_icon from "./nav_cart_icon.png";
import main_banner_bg from "./main_banner_bg.png";
import profile_icon from "./profile_icon.png";
import menu from "./menu.png";
import main_banner_bg_sm from "./main_banner_bg_sm.png";
import white from "./white.png";
import line from "./line.png";
import pantalon from "./pantalon.jpg";
import doudoune from "./doudoune.jpg";
import jogging from "./jogging.jpg";
import PullOver from "./PullOver.jpg";
import JeansOverSive from "./JeansOverSive.jpg";
import ColleRouler from "./ColleRouler.jpg";
import swittCapuche from "./swittCapuche.jpg";
import pull_cuire from "./pull_cuire.jpg";
import sweater90 from "./sweater90.jpg";
import survete from "./survete.jpg";
import adidas from "./adidas.jpg";
import FashionShadow from "./FashionShadow.jpg";
import bottomBannerImage from "./bottomBannerImage.jpg";
import bottomBannerImageSm from "./bottomBannerImageSm.jpg";
import delivery_truck_icon from "./delivery_truck_icon.png";
import leaf_icon from "./leaf_icon.png";
import coin_icon from "./coin_icon.png";
import pullTricote from "./pullTricote.jpg";
import sleeve_PullOver from "./sleeve_PullOver.jpg";
import Grandmaa from "./Grandmaa.jpg"
import kaye from "./kaye.jpg"
import opaga from "./opaga.jpg"
import add_address_iamge from "./add_address_iamge.png"

const assets = {
  logo,
  seahrc,
  nav_cart_icon,
  main_banner_bg,
  profile_icon,
  menu,
  main_banner_bg_sm,
  white,
  line,
  pantalon,
  doudoune,
  jogging,
  PullOver,
  JeansOverSive,
  ColleRouler,
  swittCapuche,
  pull_cuire,
  sweater90,
  survete,
  adidas,
  FashionShadow,
  bottomBannerImage,
  bottomBannerImageSm,
  delivery_truck_icon,
  leaf_icon,
  coin_icon,
  pullTricote,
  sleeve_PullOver,
  Grandmaa,
  kaye,
  opaga,
  add_address_iamge,
  add_icon: profile_icon,
  product_list_icon: coin_icon,
  order_icon: delivery_truck_icon,
  upload_area: add_address_iamge,
};

export const categories = [
  {
    text: "Vintage Doudoune",
    path: "doudoune",
    image: doudoune,
    bgColor: "#FFF",
  },
  {
    text: "Vintage Pantalon",
    path: "pantalon",
    image: pantalon,
    bgColor: "#FFF",
  },
  {
    text: "Vintage Jogging",
    path: "jogging",
    image: jogging,
    bgColor: "#FFF",
  },
  {
    text: "Vintage PullOver",
    path: "PullOver",
    image: PullOver,
    bgColor: "#FFF",
  },
  {
    text: "Vintage JeansOverSive",
    path: "JeansOverSive",
    image: JeansOverSive,
    bgColor: "#FFF",
  },
  {
    text: "Vintage swittCapuche",
    path: "swittCapuche",
    image: swittCapuche,
    bgColor: "#FFF",
  },
  {
    text: "Vintage pullTricot",
    path: "pullTricote",
    image: pullTricote,
    bgColor: "#FFF",
  },
  {
    text: "Vintage sleeve_PullOver",
    path: "sleeve_PullOver",
    image: sleeve_PullOver,
    bgColor: "#FFF",
  },
  {
    text: "Vintage ColleRouler",
    path: "ColleRouler",
    image: ColleRouler,
    bgColor: "#FFF",
  },
  {
    text: "Vintage Grandmaa",
    path: "Grandmaa",
    image: Grandmaa,
    bgColor: "#FFF",
  },
  {
    text: "Vintage kaye",
    path: "kaye",
    image: kaye,
    bgColor: "#FFF",
  },
  {
    text: "Vintage Opaga",
    path: "opaga",
    image: opaga,
    bgColor: "#FFF",
  }
];
export const features = [
  {
    icon: delivery_truck_icon,
    title: "Livraison rapide",
    description:"Livraison en 24h.",
  },
  {
    icon: leaf_icon,
    title:"impact écologique réduit.",
    description:"Le passé devient l’avenir durable.",
  },
  {
    icon:coin_icon,
    title:"stylé, écolo et économique.",
    description:"Économise malin, choisis le vintage !"
  },
  {
    icon:add_address_iamge,
    title:"stylé, écolo et économique.",
    description:"add_iamge, choisis  !"
  }
];
export const footerLinks = [
  {
    title: "Accès rapide",
    links: [
      { text: "Accueil", url: "/" },
      { text: "Tendances", url: "/#tendances-du-moment" },
      { text: "Promotions", url: "/#categories" },
      { text: "contacter", url: "#" }
    ]
  },
  {
    title: "Besoin d'aide",
    links: [
      { text: "Information de livraison", url: "#" },
      { text: "Retours et remboursement", url: "#" },
      { text: "Methode de paiement", url: "#" },
      { text: "Suivi des commandes", url: "#" }
    ]
  },
  {
    title: "Media Sociaux",
    links: [
      { text: "Instagram", url: "#" },
      { text: "Twitter", url: "#" },
      { text: "Facebook", url: "#" },
      { text: "Youtube", url: "#" }
    ]
  }
];

export const dummyProducts = [
  {
    _id: "1",
    name: "FashionShadow",
    category: "Pantalon",
    price: 25,
    offerPrice: 20,
    image: [FashionShadow],
    inStock: true
  },
  {
    _id: "2",
    name: "pull_cuire ",
    category: "doudoune",
    price: 80,
    offerPrice: 65,
    image: [pull_cuire ],
    inStock: true
  },
  {
    _id: "3",
    name: "Jogging survete",
    category: "jogging",
    price: 40,
    offerPrice: 20,
    image: [survete],
    inStock: true
  },
  {
    _id: "4",
    name: "sweater90",
    category: "PullOver",
    price: 50,
    offerPrice: 35,
    image: [sweater90],
    inStock: true
  },
  {
    _id: "5",
    name: "adidas",
    category: "jogging",
    price: 50,
    offerPrice: 40,
    image: [adidas],
    inStock: true
  },
  {
    _id: "6",
    name: "doudoune",
    category: "doudoune",
    price: 50,
    offerPrice: 35,
    image: [doudoune],
    inStock: true
  },
  {
    _id: "7",
    name: "pantalon",
    category: "pantalon",
    price: 60,
    offerPrice: 30,
    image: [pantalon],
    inStock: true
  },
  {
    _id: "8",
    name: "vintage PullOver",
    category: "PullOver",
    price: 70,
    offerPrice: 45,
    image: [PullOver],
    inStock: true
  },
  {
    _id: "9",
    name: "jeansOverSive",
    category: "JeansOverSive",
    price: 60,
    offerPrice: 50,
    image: [JeansOverSive],
    inStock: true
  },
  {
    _id: "10",
    name: "swittCapuche",
    category: "swittCapuche",
    price: 100,
    offerPrice: 46,
    image: [swittCapuche],
    inStock: true
  },
  {
    _id: "11",
    name: "Vintage PullTricot",
    category: "pullTricote",
    price: 50,
    offerPrice: 40,
    image: [pullTricote],
    inStock: true
  },
  {
    _id: "12",
    name: "Sleeve_PullOver",
    category: "Tricot",
    price: 80,
    offerPrice: 60,
    image: [sleeve_PullOver],
    inStock: true
  },
  {
    _id: "13",
    name: "ColleRouler",
    category: "ColleRouler",
    price: 90,
    offerPrice: 25,
    image: [ColleRouler],
    inStock: true
  },
  {
    _id: "14",
    name: "Grandmaa",
    category: "Grandmaa",
    price: 100,
    offerPrice: 55,
    image: [Grandmaa],
    inStock: true
  },
  {
    _id: "15",
    name: "vintage Kaye",
    category: "kaye",
    price: 60,
    offerPrice: 33,
    image: [kaye],
    inStock: true
  },
  {
    _id: "16",
    name: "vintage Opaga",
    category: "opaga",
    price: 70,
    offerPrice: 48,
    image: [opaga],
    inStock: true
  }
];
export default assets;

export const dummyOrders = [
  {
    id: "ORD-001",
    paymentType: "Carte bancaire",
    amount: 129.99,
    status: "Livré",
    isPaid: true,
    createdAt: "2026-05-20T10:00:00.000Z",
    address: {
      firstName: "Karim",
      lastName: "Benali",
      street: "12 Rue des Fleurs",
      city: "Paris",
      state: "Île-de-France",
      zipcode: "75001",
      country: "France",
      phone: "+33 6 12 34 56 78"
    },
    items: [
      {
        quantity: 2,
        product: {
          name: "FashionShadow",
          category: "Pantalon",
          offerprice: 20,
          image: [FashionShadow]
        }
      },
      {
        quantity: 1,
        product: {
          name: "pull_cuire",
          category: "doudoune",
          offerprice: 65,
          image: [pull_cuire]
        }
      }
    ]
  },
  {
    id: "ORD-002",
    paymentType: "PayPal",
    amount: 74.50,
    status: "En cours",
    isPaid: false,
    createdAt: "2026-06-01T14:30:00.000Z",
    address: {
      firstName: "Sara",
      lastName: "Moussa",
      street: "8 Avenue Victor Hugo",
      city: "Lyon",
      state: "Auvergne-Rhône-Alpes",
      zipcode: "69003",
      country: "France",
      phone: "+33 7 98 76 54 32"
    },
    items: [
      {
        quantity: 1,
        product: {
          name: "sweater90",
          category: "PullOver",
          offerprice: 35,
          image: [sweater90]
        }
      }
    ]
  },
  {
    id: "ORD-003",
    paymentType: "Carte bancaire",
    amount: 210.00,
    status: "En attente",
    isPaid: false,
    createdAt: "2026-06-03T09:15:00.000Z",
    address: {
      firstName: "Omar",
      lastName: "Tazi",
      street: "3 Boulevard Pasteur",
      city: "Marseille",
      state: "Provence-Alpes-Côte d'Azur",
      zipcode: "13006",
      country: "France",
      phone: "+33 6 55 44 33 22"
    },
    items: [
      {
        quantity: 1,
        product: {
          name: "vintage PullOver",
          category: "PullOver",
          offerprice: 45,
          image: [PullOver]
        }
      },
      {
        quantity: 2,
        product: {
          name: "ColleRouler",
          category: "ColleRouler",
          offerprice: 25,
          image: [ColleRouler]
        }
      }
    ]
  }
];