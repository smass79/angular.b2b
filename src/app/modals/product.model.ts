import { oImagen } from "./imagen";

// Product Tag
export type ProductTags = 'nike' | 'puma' | 'lifestyle' | 'caprese';

// Product Colors
export type ProductColor = 'white' | 'black' | 'red' | 'green' | 'purple' | 'yellow' | 'blue' | 'gray' | 'orange' | 'pink';



export class Product {
  id?: number;
  name?: string;
  price?: number;
  type?: string;
  salePrice?: number;
  discount?: number;
  pictures?: oImagen[]=[];
  state?: string;
  shortDetails?: string;
  description?: string;
  stock?: number;
  newPro?: boolean;
  brand?: string;
  sale?: boolean;
  category?: string;
  tags?: ProductTags[];
  colors?: ProductColor[];
  SKU?:string;
  catalogMode?:boolean;
  alicIva?:number;
  pathimg?:string;
  OfertaID?:number;
  Bonif?:number=0;
  hasBonif?:boolean = false;

  constructor(
    id?: number,
    name?: string,
    price?: number,
    salePrice?: number,
    discount?: number,
    pictures?: oImagen[],
    type?: string,
    shortDetails?: string,
    description?: string,
    stock?: number,
    state?: string,
    newPro?: boolean,
    brand?: string,
    sale?: boolean,
    category?: string,
    tags?: ProductTags[],
    colors?: ProductColor[],
    SKU?:string,
    catalogMode?:boolean,
    alicIva?:number,
    img?:string,
    pOfertaID?:number,
    pBonif?:number,
    phasBonif?:boolean
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.type = type;
    this.salePrice = salePrice;
    this.discount = discount;
    this.pictures = pictures;
    this.shortDetails = shortDetails;
    this.description = description;
    this.stock = 9000000;
    this.newPro = newPro;
    this.brand = brand;
    this.sale = sale;
    this.category = category;
    this.tags = tags;
    this.colors = colors;
    this.state = state;
    this.SKU = SKU;
    this.catalogMode = catalogMode;
    this.alicIva=alicIva;
    this.pathimg=img;
    this.OfertaID=pOfertaID;
    this.Bonif=pBonif;
    this.hasBonif = phasBonif;
  }

 }
  // Color Filter
  export interface ColorFilter {
    color?: ProductColor;
  }
