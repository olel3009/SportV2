let exportThese:Array<Number>;
exportThese =[];

function exportToCsv(idArray:Array<Number>){
  //get Actual Values for export from Database/API here
  console.log(idArray);
  const csvRows = [
    ["ID"], // CSV headers
    idArray.map((row) => [
      row
    ]),
  ];
  if(idArray.length<1){
    alert("Bitte wählen sie die Athleten aus, welche sie exportieren wollen!");
  }else{
    const csvContent = csvRows.map((e) => e.join(",")).join("\n");

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    if (idArray.length==1){
      link.download = `${idArray[0]}_data.csv`;
    }else{
      link.download = `athleten_export_data.csv`;
    }
    link.click();
    URL.revokeObjectURL(url);
  }
}

export function  ExportCheckbox({id}){
  let willBeExported = false;
  function putID(yes:boolean, id:Number){
    willBeExported=!yes;
    if(willBeExported){
      exportThese.push(id);
    }else{
      exportThese=exportThese.filter(item=> item!=id);
    }
  }
  return(
  <input id = {`${id}export_checkbox`} name='csvCheckbox' type='checkbox' onChange={()=>putID(willBeExported, id)}></input>
  );
}

export function MassExportButton(){
  function massExport(){
    exportToCsv(exportThese);
  }
  return(
    <button name="csvMassExportButt" onClick = {()=>massExport()}>
        Alle ausgewählten als CSV exportieren
    </button>
    );
}

export function SingleCSVExportButton({id, vorName, nachName}){
  function exportAsCSV(id){
    let justThis:Array<Number>; 
    justThis =[id];
    exportToCsv(justThis);
  }
  return(
  <button id = {`${id}export_button`} name='csvSingleExportButt' onClick = {()=>exportAsCSV(id)}>
      {vorName} {nachName} als CSV exportieren
  </button>
  );
}