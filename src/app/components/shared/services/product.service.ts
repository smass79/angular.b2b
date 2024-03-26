import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subscriber } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Product } from 'src/app/modals/product.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { ResponseI } from './ResponseI';
import { oImagen } from 'src/app/modals/imagen';



// Get product from Localstorage
let products = JSON.parse(localStorage.getItem("compareItem")) || [];

@Injectable({
  providedIn: 'root'
})
export class ProductService  extends ApiService {
  public currency : string = 'USD';
  public catalogMode : boolean = false;

  private _url: string = "assets/data/";
  public url = "assets/data/banners.json";

  public compareProducts : BehaviorSubject<Product[]> = new BehaviorSubject([]);
  public observer   :  Subscriber<{}>;

  constructor(private httpClient: HttpClient, public snackBar: MatSnackBar) {
    super(httpClient);
    this.compareProducts.subscribe(products => products = products)
  }

  private products(): Observable<Product[]> {
    return this.httpClient.get<Product[]>('assets/data/products2.json');
  }

  public productsImgExist(pimage:oImagen[]=[]): Observable<any> {
    let headers = this._headers;
    let params = new FormData();
    //let params = new HttpParams();
    params.append('arr_img', JSON.stringify(pimage));
    const options = {  headers: headers };
    return this._httpcli.post<ResponseI>(this.URL_SERVER + "getimages", params, options );
  }

  public productosDestacados(): Observable<ResponseI> {
    let headers = this._headers;
    let params = new FormData();
    const options = {  headers: headers };
    return this._httpcli.post<ResponseI>(this.URL_SERVER + "getdestacados", params, options );
  }

  public productosRelacionados(ProductoID:number): Observable<ResponseI> {
    let headers = this._headers;
    let params = new FormData();
    params.append('PRDID', ProductoID.toString());
    const options = {  headers: headers };
    return this._httpcli.post<ResponseI>(this.URL_SERVER + "getrelacionados", params, options );
  }

  public productosIngresos(): Observable<ResponseI> {
    let headers = this._headers;
    let params = new FormData();
    const options = {  headers: headers };
    return this._httpcli.post<ResponseI>(this.URL_SERVER + "ultimosingresos", params, options );
  }

  public productosOfertas(): Observable<ResponseI> {
    let headers = this._headers;
    let params = new FormData();
    const options = {  headers: headers };
    return this._httpcli.post<ResponseI>(this.URL_SERVER + "getofertas", params, options );
  }

  public toProducto(pprod:any,bonif:number=0):Product{
    

    if (pprod.prod_arr==undefined){
        var images:oImagen[] = [
          {
            "small": pprod.prod_img,
            "big": pprod.prod_img
          }  ];
    }else{
        var images:oImagen[] = pprod.prod_arr;
    }
    //pprod.PrecioConDto = pprod.PrecioSinIva; 
    pprod['PrecioConDto'] = pprod.PrecioSinIva; 
    if (bonif!=0){
    //  pprod.PrecioConDto = pprod.PrecioSinIva - (pprod.PrecioSinIva * bonif / 100);
      pprod['PrecioConDto'] = pprod.PrecioSinIva - (pprod.PrecioSinIva * bonif / 100);
    }
    let descrip = pprod.catDescripcion +' | '+pprod.scaDescripcion;

    return new Product(pprod.prdProductoId,
                        pprod.prdNombre,
                        (pprod.OfertaId==0)?pprod['PrecioConDto']:pprod.PrecioOfertaSinIva,
                        pprod.PrecioSinIva,
                        0,images,"type","showdetails",descrip,
                        0,"state",false,pprod.marDescripcion,true,pprod.catDescripcion,[],
                        [],pprod.SKU,false,pprod.alicIVA,images[0].big,pprod.OfertaId,bonif,
                        (bonif==0)?false:true);
  }

  public banners(): Observable<any[]>{
    return this.httpClient.get<any[]>(this.URL_SERVER +'getmainbanners');
  }


    // Get Banners
    public getBanners() {
      return this.banners();
    }

    // Get Banners
    public getProducts(): Observable<Product[]> {
      return this.products();
    }


      // Get Products By Id
  public getProduct(id: number): Observable<ResponseI> {

    let headers = this._headers;
    let params = new FormData();
    //let params = new HttpParams();
    params.append('PRDID', id.toString());
    const options = {  headers: headers };
    return this._httpcli.post<ResponseI>(this.URL_SERVER + "getproductoid", params, options );


  }


        /*
      ---------------------------------------------
      ----------  Compare Product  ----------------
      ---------------------------------------------
   */

// Get Compare Products
public getComapreProducts(): Observable<Product[]> {
  const itemsStream = new Observable(observer => {
    observer.next(products);
    observer.complete();
  });
  return <Observable<Product[]>>itemsStream;
}

// If item is aleready added In compare
public hasProduct(product: Product): boolean {
  const item = products.find(item => item.id === product.id);
  return item !== undefined;
}

  // Get Products By Slug
  public getProductBySlug(slug: string): Observable<Product> {
    return this.products().pipe(map(items => { 
      return items.find((item: any) => { 
        return item.name.replace(' ', '-') === slug; 
      }); 
    }));
  }

 // Add to compare
 public addToCompare(product: Product): Product | boolean {
  let message, status;
  var item: Product | boolean = false;
  if (this.hasProduct(product)) {
    item = products.filter(item => item.id === product.id)[0];
    const index = products.indexOf(item);
    this.snackBar.open('The product  ' + product.name + ' already added to comparison list.', '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 });

  } else {
    if(products.length < 4)
      products.push(product);
      message = 'The product ' + product.name + ' has been added to comparison list.';
      status = 'success';
      this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });

  }
    localStorage.setItem("compareItem", JSON.stringify(products));
    return item;
}

// Removed Product
public removeFromCompare(product: Product) {
  if (product === undefined) { return; }
  const index = products.indexOf(product);
  products.splice(index, 1);
  localStorage.setItem("compareItem", JSON.stringify(products));
}

   // Get Products By category
   public getProductByCategory(category: string): Observable<Product[]> {
    return this.products().pipe(map(items =>
       items.filter((item: Product) => {
         if(category == 'all')
            return item
            else
            return item.category === category;

       })
     ));
  }

  // Get Products By category
  public getProductByCategoryID(ID:number): Observable<ResponseI> {
      let headers = this._headers;
      let params = new FormData();
      //let params = new HttpParams();
      params.append('CATID', ID.toString());
      const options = {  headers: headers };
      return this._httpcli.post<ResponseI>(this.URL_SERVER + "getbycategoriaid", params, options );
  }

  // Get Products By category
   public getProductByName(name:string): Observable<ResponseI> {
      let headers = this._headers;
      let params = new FormData();
      //let params = new HttpParams();
      params.append('name', name.toString());
      const options = {  headers: headers };
      return this._httpcli.post<ResponseI>(this.URL_SERVER + "getbyname", params, options );
  }

}
