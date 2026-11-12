"use strict";

/** Simulação abstrata de aeroporto fictício; não representa procedimentos reais de aviação. */
function criarControle() {
  return Object.freeze({ relogioMin: 0, voos: Object.freeze([]) });
}
function validarTempo(valor) {
  if(!Number.isSafeInteger(valor) || valor<0)throw new RangeError("Tempo inválido.");
}
function solicitar(estado,{id,operacao,duracaoMin}) {
  if(typeof id!=="string" || !/^[A-Z0-9-]{1,24}$/.test(id))
    throw new RangeError("Identificador inválido.");
  if(!["POUSO","DECOLAGEM"].includes(operacao))throw new RangeError("Operação inválida.");
  if(!Number.isSafeInteger(duracaoMin)||duracaoMin<1||duracaoMin>120)
    throw new RangeError("Duração inválida.");
  if(estado.voos.some(v=>v.id===id))throw new RangeError("Voo duplicado.");
  const voo=Object.freeze({id,operacao,duracaoMin,status:"aguardando",inicio:null,fim:null});
  return Object.freeze({...estado,voos:Object.freeze([...estado.voos,voo])});
}
function alterar(estado,id,fn) {
  if(!estado.voos.some(v=>v.id===id))throw new RangeError("Voo inexistente.");
  return Object.freeze({...estado,voos:Object.freeze(estado.voos.map(v=>v.id===id?Object.freeze(fn(v)):v))});
}
function autorizar(estado,id,agoraMin) {
  validarTempo(agoraMin);
  if(agoraMin < estado.relogioMin) throw new RangeError("Tempo retroativo no aeroporto.");
  if(estado.voos.some(v=>v.status==="autorizada"))
    throw new RangeError("Pista ocupada: finalize a operação antes de autorizar outra.");
  const atualizado = alterar(estado,id,voo=>{
    if(voo.status!=="aguardando")throw new RangeError("Voo não está aguardando.");
    const fim=agoraMin+voo.duracaoMin;
    if(!Number.isSafeInteger(fim))throw new RangeError("Tempo excedido.");
    return {...voo,status:"autorizada",inicio:agoraMin,fim};
  });
  return Object.freeze({...atualizado,relogioMin:agoraMin});
}
function finalizar(estado,id,agoraMin) {
  validarTempo(agoraMin);
  if(agoraMin < estado.relogioMin) throw new RangeError("Tempo retroativo no aeroporto.");
  const atualizado = alterar(estado,id,voo=>{
    if(voo.status!=="autorizada")throw new RangeError("Voo não autorizado.");
    if(agoraMin<voo.fim)throw new RangeError("Pista permanece ocupada até o fim.");
    return {...voo,status:"concluida"};
  });
  return Object.freeze({...atualizado,relogioMin:agoraMin});
}
function cancelar(estado,id) {
  return alterar(estado,id,voo=>{
    if(voo.status!=="aguardando")throw new RangeError("Só é possível cancelar solicitação pendente.");
    return {...voo,status:"cancelada"};
  });
}
function fila(estado) { return estado.voos.filter(v=>v.status==="aguardando"); }
module.exports={criarControle,solicitar,autorizar,finalizar,cancelar,fila};
