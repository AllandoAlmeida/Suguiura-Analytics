import * as XLSX from 'xlsx';

const arquivo = 'C:/Users/aland/Downloads/Vendas vendedores Suguiura MANO POZZA (2).xlsx';

const workbook = XLSX.readFile(arquivo);

for (const nomeAba of workbook.SheetNames) {
  console.log('\nABA:', nomeAba);

  const sheet = workbook.Sheets[nomeAba];

  const linhas = XLSX.utils.sheet_to_json<any[]>(sheet, {
    header: 1,
    raw: true,
    defval: null,
  });

  for (let i = 0; i < Math.min(linhas.length, 25); i++) {
    console.log(i, linhas[i]);
  }
}