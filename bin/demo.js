"use strict";
const {criarControle,solicitar,autorizar,finalizar}=require("../src/controle");
let controle=criarControle();
controle=solicitar(controle,{id:"DEMO-1",operacao:"POUSO",duracaoMin:5});
controle=solicitar(controle,{id:"DEMO-2",operacao:"DECOLAGEM",duracaoMin:3});
controle=autorizar(controle,"DEMO-1",0);
controle=finalizar(controle,"DEMO-1",5);
controle=autorizar(controle,"DEMO-2",5);
console.log(JSON.stringify(controle.voos,null,2));
