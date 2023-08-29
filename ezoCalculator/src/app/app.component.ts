import { Component } from '@angular/core';
import { from } from 'rxjs';
import { notes } from './interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ezoCalculator';
  total = 0;
  alerts:any =[]
  withdraw= 0;
  withdrawnDenominations: { [denom: number]: number } = {};
  notes =[2000,500,200,100]
  moneyAvailable :notes= {
    '2000': {
      number: 0,
      inserted: 0
    },
    '500': {
      number: 0,
      inserted: 0
    },
    '200': {
      number: 0,
      inserted: 0
    },
    '100': {
      number: 0,
      inserted: 0
    }
  }
  depositMoney(form:any){
  console.log(form.value);
  let flag =true;
  for(let key in form.value){
    const value = (form.value[key]);
    if(this.isFloat(value)){
      this.alerts.push({
        type:'danger',
        heading:'Can Not Deposit',
        output: this.moneyFormator(form.value),
        time:`${new Date()}`
      });
      flag =false;
      break
    }
  let  note = parseInt(key);
  console.log('====================================');
  console.log(value %note);
  console.log('====================================');
  if(value % note !==0){

    this.alerts.push({
      type:'danger',
      heading:'Cannot Deposit',
      output: this.moneyFormator(form.value),
      time:`${new Date()}`
    });
    flag =false;
    break
  }
   if(Number(value)% note === 0){
    flag =true;
    this.total +=Number(value);
    this.moneyAvailable[key].number =this.moneyAvailable[key].number + Number(value)/note ;
   }
    
  }
    if(flag=true){
     this.alerts.push({
      type:'info',
      heading:'Deposit',
      output: this.moneyFormator(form.value),
      time:`${new Date()}`
    });}

  }
  zero(){
    return 1;
  }
 isFloat(value:any) {
    return !isNaN(value) && Number(value) === value&& value% 1 !== 0;
  }
  moneyFormator(value:any){
   let output = ''
   for(const key in value){
     output += `${key}: ${value[key]} `
   }
   return output
  }
  getAlert(message:string,type:string){
    let element = document.getElementById('alerts');
    const newAlert = document.createElement("div");
    newAlert.className = `alert alert-${type}  fade show`;
    newAlert.role = "alert";
    const h6 = document.createElement("h6");
    h6.innerHTML = message;
    h6.className=`alert-heading`
    const p = document.createElement("p");
    p.innerHTML = `${new Date().getTimezoneOffset()}`;
    newAlert.appendChild(h6);
    newAlert.appendChild(p);
    element?.appendChild(newAlert)
  }
  withdrawMoney(){
  

    if(this.isFloat(this.withdraw)){
      this.alerts.push({
        type:'danger',
        heading:'Cannot Withdraw',
        output: null,
        time:`${new Date()}`
      });
      return
    }
     if(this.total ===0 ||this.total<this.withdraw){
      this.alerts.push({
        type:'danger',
        heading:'Cannot Withdraw',
        output: null,
        time:`${new Date()}`
      });
      return;
     }
     console.log(this.moneyAvailable)
    this.withdrawAmount();
  }


 

  

  

  withdrawAmount(): void {
    this.resetWithdrawal();
    let remainingAmount = this.withdraw >0 ?this.withdraw :1;

    for (const key in this.moneyAvailable) {
      console.log(key); 
      let denom = parseInt(key);
      if (remainingAmount >= denom && (this.moneyAvailable[key].number) > 0) {
      let notes = Math.min(Math.floor(remainingAmount/denom), this.moneyAvailable[key].number);
      console.log(notes)
        this.withdrawnDenominations[denom] = notes;
        this.moneyAvailable[denom].number -= notes;
        remainingAmount -= notes * denom;
      }
    }

    if (remainingAmount === 0) {
      this.alerts.push({
        type:'success',
        heading:'Withdraw',
        output: `${this.moneyFormator(this.withdrawnDenominations)}`,
        time:`${new Date()}`
      });
    } else {
      this.alerts.push({
        type:'danger',
        heading:'Cannot Withdraw',
        output: null,
        time:`${new Date()}`
      });
      return;
    }
  }

  private resetWithdrawal(): void {
    this.withdrawnDenominations = {};
  }
}


