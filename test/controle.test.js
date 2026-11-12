"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {criarControle,solicitar,autorizar,finalizar,cancelar,fila}=require("../src/controle");

function doisVoos() {
  let estado=criarControle();
  estado=solicitar(estado,{id:"AZ-100",operacao:"POUSO",duracaoMin:5});
  estado=solicitar(estado,{id:"GOL-2",operacao:"DECOLAGEM",duracaoMin:3});
  return estado;
}
test("apenas um voo autorizado por vez",()=>{
  const inicial=doisVoos();
  const autorizado=autorizar(inicial,"AZ-100",10);
  assert.equal(autorizado.voos[0].fim,15);
  assert.throws(()=>autorizar(autorizado,"GOL-2",12),RangeError);
  assert.equal(inicial.voos[0].status,"aguardando");
  assert.equal(autorizado.voos[1].status,"aguardando");
  assert.equal(fila(autorizado).length,1);
});
test("após finalizar, segundo voo recebe autorização",()=>{
  const inicial=autorizar(doisVoos(),"AZ-100",10);
  assert.throws(()=>finalizar(inicial,"AZ-100",14),RangeError);
  const final=finalizar(inicial,"AZ-100",15);
  const seguinte=autorizar(final,"GOL-2",15);
  assert.equal(seguinte.voos[0].status,"concluida");
  assert.equal(seguinte.voos[1].inicio,15);
});
test("cancelar pedido pendente não modifica outro voo",()=>{
  const inicial=autorizar(doisVoos(),"AZ-100",10);
  const atualizado=cancelar(inicial,"GOL-2");
  assert.equal(atualizado.voos[1].status,"cancelada");
  assert.equal(atualizado.voos[0].status,"autorizada");
  assert.throws(()=>cancelar(atualizado,"AZ-100"),RangeError);
});
test("identificadores, estados e tempo inválidos",()=>{
  const estado=doisVoos();
  assert.throws(()=>solicitar(estado,{id:"AZ-100",operacao:"POUSO",duracaoMin:4}),RangeError);
  assert.throws(()=>solicitar(estado,{id:"X",operacao:"OUTRA",duracaoMin:4}),RangeError);
  assert.throws(()=>autorizar(estado,"x",0),RangeError);
  assert.throws(()=>autorizar(estado,"AZ-100",-1),RangeError);
  assert.throws(()=>finalizar(estado,"AZ-100",1),RangeError);
});

test("relogio monotono impede novo voo autorizado no passado",()=>{
  const inicio=doisVoos();
  const primeiro=autorizar(inicio,"AZ-100",10);
  assert.equal(primeiro.relogioMin,10);
  assert.equal(inicio.relogioMin,0);
  assert.throws(()=>finalizar(primeiro,"AZ-100",9),RangeError);
  const concluido=finalizar(primeiro,"AZ-100",15);
  assert.equal(concluido.relogioMin,15);
  assert.throws(()=>autorizar(concluido,"GOL-2",14),RangeError);
  const comNovoPedido=solicitar(concluido,{id:"TAM-4",operacao:"POUSO",duracaoMin:2});
  assert.equal(comNovoPedido.relogioMin,15);
  const cancelado=cancelar(comNovoPedido,"TAM-4");
  assert.equal(cancelado.relogioMin,15);
  assert.equal(autorizar(cancelado,"GOL-2",15).voos[1].status,"autorizada");
});
