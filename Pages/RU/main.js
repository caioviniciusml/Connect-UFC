const API_URL = "http://localhost:4000/cardapios";

const ordem = [
  "opcao1",
  "opcao2",
  "opcaoVegetariana",
  "salada",
  "guarnicao",
  "acompanhamentos",
  "suco",
  "sobremesa",
];
let datasDisponiveis = [];
let refeicoes = [];

async function getUsers() {
  data = await axios
    .get(API_URL, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    })
    .then(({ data }) => data);

  refeicoes = data;
  datas = data.map((refeicao) => refeicao.date);
  datasDisponiveis = [...new Set(datas)];

  datasDisponiveis = datasDisponiveis
    .map((data) => new Date(data))
    .sort((a, b) => a - b);

  const weekSelect = document.querySelector("#ru-day-selection");

  const select = document.createElement("select");
  select.setAttribute("id", "week-select");

  const optionDefault = document.createElement("option");
  optionDefault.innerHTML = "ESCOLHA A SEMANA";

  select.appendChild(optionDefault);

  for (let i = 0; i < datasDisponiveis.length; i += 5) {
    const option = document.createElement("option");
    const dia = datasDisponiveis[i].getDate();
    const mes = datasDisponiveis[i].getMonth() + 1;
    const diaSexta = datasDisponiveis[i + 4].getDate();
    const mesSexta = datasDisponiveis[i + 4].getMonth() + 1;
    option.innerHTML = `SEMANA (${dia}/${mes} - ${diaSexta}/${mesSexta})`;
    option.onclick = ()=>{
      renderDaysOptions(datasDisponiveis[i].toISOString())
      changeAlmoco(datasDisponiveis[i].toISOString())
    }
    select.appendChild(option);
  }
  const divDaySelect = document.createElement('div')
  divDaySelect.setAttribute('id','day-select')
  weekSelect.appendChild(select);
  weekSelect.appendChild(divDaySelect);

}

function changeAlmoco(date) {
  const tableAlmoco = document.querySelector("#almocoTable");
  const tableJantar = document.querySelector("#jantarTable");

  const refeicao = refeicoes.filter(refeicao=> refeicao.date == date)
  const almoco = refeicao.find(ref=>ref.tipo == 'almoco')
  const jantar = refeicao.find(ref=>ref.tipo == 'jantar')

  
  for(let i = 0; i<ordem.length; i++){
    const linhaAlmoco = tableAlmoco.querySelector(`tr:nth-child(${i+1}) td:nth-child(2)`);
    linhaAlmoco.innerHTML = almoco[ordem[i]];

    const linhaJantar = tableJantar.querySelector(`tr:nth-child(${i+1}) td:nth-child(2)`);
    linhaJantar.innerHTML = jantar[ordem[i]];
  }
}

function renderDaysOptions(initialDate){
  const dias = ['Segunda','Terça', 'Quarta', 'Quinta', 'Sexta']
  const divDaySelect = document.querySelector('#day-select')
  divDaySelect.innerHTML = ''

  let date = new Date(initialDate)

  for(let dia of dias){
    const dateToChange = date.toISOString()
    date.setDate(date.getDate() + 1)
    const elem = document.createElement('button')
    elem.setAttribute('id','day-button')
    elem.innerHTML = dia
    elem.onclick = ()=>changeAlmoco(dateToChange)
    divDaySelect.appendChild(elem)

  }

}
window.onload = getUsers;
