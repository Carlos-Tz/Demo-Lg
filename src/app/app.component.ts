import { Component } from '@angular/core';
import * as num from 'written-number';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  myForm: FormGroup;
  total: number = 0;
  myformValuesChanges$;
  numero :  num;

  constructor(
    private fb: FormBuilder,
    private currencyPipe: CurrencyPipe 
  ){  }

  ngOnInit(){
    
    this.myForm = this.fb.group({
      units: this.fb.array([
        this.getUnit()
      ])
    });
    this.myformValuesChanges$ = this.myForm.controls['units'].valueChanges;
    this.myformValuesChanges$.subscribe(units => {
      this.updateTotalUnitPrice(units);
      this.numero =  num(this.total,{lang:'es'});
      this.numero = this.numero.toString();
      this.numero = this.numero[0].toUpperCase() + this.numero.slice(1);
    });
    this.generRow();
  }

  private generRow(){
    for(let i= 1; i<20; i++){
      this.addUnit();
    }
  }

  private getUnit(){
    return this.fb.group({
      qty:[''],
      price:[''],
      subtotal:['']
    });
  }

  private addUnit(){
    const control = <FormArray>this.myForm.controls['units'];
    control.push(this.getUnit());
  }

  getControls(frmGrp: FormGroup, key: string) {
  return (<FormArray>frmGrp.controls[key]).controls;
  }

  private updateTotalUnitPrice(units: any) {
    const control = <FormArray>this.myForm.controls['units'];
    this.total = 0;
    for (let i in units) {
      let totalUnitPrice = (units[i].qty*units[i].price);
      let totalUnitPriceFormatted = this.currencyPipe.transform(totalUnitPrice, 'USD', 'symbol-narrow', '1.2-2');
      if(totalUnitPrice != 0)
      control.at(+i).get('subtotal').setValue(totalUnitPriceFormatted, {onlySelf: true, emitEvent: false});
      this.total += totalUnitPrice;
    }
  }
}
