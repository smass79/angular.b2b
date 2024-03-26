import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../shared/services/account.service';
import { CartService } from '../../shared/services/cart.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.sass']
})
export class MyAccountComponent implements OnInit {

  isLogged:boolean=false;
  sendMensaje:string="Cargando";
  logeando:boolean = false;
  enviado:boolean=false;
  enviando:boolean=false;

  token:string;

  mydataForm = new FormGroup({
    mynombre: new FormControl('',[Validators.required]),
    mydireccion: new FormControl('',[Validators.required]),
    myciudad: new FormControl('',[Validators.required]),
    mytelefono: new FormControl('',[Validators.required]),
  });

  changueForm = new FormGroup({
    passwordActual: new FormControl('',[Validators.required]),
    passwordNew: new FormControl('',[Validators.required]),
    passwordNewRe: new FormControl('',[Validators.required]),
  });

  profileForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });
  
  accountForm = new FormGroup({
    nrousuario: new FormControl('',[
      Validators.required,
      Validators.pattern("^[0-9]*$")
    ]),
    usermail: new FormControl(''),
  });

  constructor(private accountService :AccountService,
              public cartService: CartService, 
              private router: Router,
              public snackBar: MatSnackBar,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.hide();
    let ouser = this.accountService.getAccount();

    if (ouser!=undefined){
        this.token = ouser.Token;
       
        this.isLogged = true;
        this.accountService.getmydata().subscribe(res => {

          this.mydataForm.controls["mynombre"].patchValue(res.payload["cliNombre"]);
          this.mydataForm.controls['mynombre'].disable();
  
          this.mydataForm.controls["mydireccion"].patchValue(res.payload["cliDireccion"]);
          this.mydataForm.controls['mydireccion'].disable();
  
          this.mydataForm.controls["mytelefono"].patchValue(res.payload["cliCelular"]);
          this.mydataForm.controls['mytelefono'].disable();    

          this.mydataForm.controls['myciudad'].disable();    


  
      });
    }
 
  }

  onVerDeuda(){
    alert("hola");
    this.router.navigate(['/pages/deuda']);       
  }

  downloadList(){
    this.snackBar.open("COMENZANDO LA DESCARGA... AGUARDE POR FAVOR", '×', { panelClass: ['success'], 
                          verticalPosition: 'top', 
                          duration: 5000 });
    const link = document.createElement('a');
    link.setAttribute('href', environment.API_URL + 'downloadlista?key=' + this.token);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  onSubmit() {
    this.logeando = true;
    this.sendMensaje = "Ingresando con usuario y password";
    this.spinner.show();
    this.accountService.login(this.profileForm.controls["username"].value,
                              this.profileForm.controls["password"].value).subscribe(res => {
                               if (res.status=="success"){
                                this.snackBar.open("LOGIN EXISTOSO", '×', { panelClass: ['success'], 
                                                                            verticalPosition: 'top', 
                                                                            duration: 5000 });
                                this.accountService.storeAccount(res.payload);     
                                this.cartService.removeAll();                       
                                this.router.navigate(['/']);       
                               }else{
                                this.snackBar.open("USUARIO O PASSWORD INCORRECTOS", '×', { panelClass: ['error'], verticalPosition: 'top', duration: 5000 });
                               }
                              this.logeando = false;
                              this.spinner.hide();
                              });


  }

  onChanguePassword() {
    if (this.changueForm.controls["passwordNew"].value != this.changueForm.controls["passwordNewRe"].value){
      this.snackBar.open("Password y Re Password deben ser iguales", '×', { panelClass: ['error'], verticalPosition: 'top', duration: 5000 });
      return
    }
    this.logeando = true;
    this.sendMensaje = "Actualizando password";
    this.spinner.show();
    this.accountService.changuePassword(this.changueForm.controls["passwordActual"].value,
                                        this.changueForm.controls["passwordNew"].value).subscribe(res => {
                               if (res.status=="success"){
                                this.snackBar.open("PASSWORD ACTUALIZADO", '×', { panelClass: ['success'], 
                                                                            verticalPosition: 'top', 
                                                                            duration: 5000 });
                                this.accountService.storeAccount(res.payload);     
                                this.cartService.removeAll();                       
                                this.router.navigate(['/']);       
                               }else{
                                this.snackBar.open("USUARIO O PASSWORD INCORRECTOS", '×', { panelClass: ['error'], verticalPosition: 'top', duration: 5000 });
                               }
                              this.logeando = false;
                              this.spinner.hide();
                              });


  }

  onGetAccount(){
    this.enviado = false;
    this.enviando = true;
    this.sendMensaje = "Aguarde por favor";
    this.spinner.show();
    this.accountService.sendAccount(this.accountForm.controls["nrousuario"].value,
                                    this.accountForm.controls["usermail"].value).subscribe(res => {
     if (res.status=="success"){
      this.enviado = true;
      this.enviando = false;
     }else{
      this.snackBar.open("DATOS INCORRECTOS... verifique el numero de cliente y mail ingresado", '×', { panelClass: ['error'], verticalPosition: 'top', duration: 5000 });
      this.enviando = false;
     }

    this.spinner.hide();
    });
  }
}
