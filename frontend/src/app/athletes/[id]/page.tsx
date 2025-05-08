import { useParams } from "next/navigation";
import { Athlete, Feat } from "@/models/athlete";
import { getAllDisciplines, getAthleteById, getFeatsById } from "@/athlete_getters";
import Link from "next/link";
import { Undo2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CardTab, TabSwitcher, TabContent } from "./tab_cards";
import { boolean } from "zod";
import ErrorDisplay from "@/components/ErrorDisplay";

const getAge = (dateString: string) => {
  const [day, month, year] = dateString.split("-").map(Number);
  const birthday = new Date(year, month - 1, day);
  const today = new Date();
  let age = today.getFullYear() - birthday.getFullYear();

  const hasHadBirthdayThisYear =
    today.getMonth() > birthday.getMonth() ||
    (today.getMonth() === birthday.getMonth() &&
      today.getDate() >= birthday.getDate());

  if (!hasHadBirthdayThisYear) {
    age--;
  }
  return age;
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
    const id = parseInt((await params).id);
    const athlete = await getAthleteById(id);
    const feats= await getFeatsById(id);
    const disciplines= await getAllDisciplines();
    console.log(disciplines);
    console.log(feats);
    let actDiscIds:boolean[]=[false, false, false, false];
    feats?.forEach(feat => {
      // first, safely pull out discipline_id
      const id = feat?.ruling?.discipline_id;
    
      // make sure it's a real number in [1..4]
      if (typeof id === "number" && id >= 1 && id <= actDiscIds.length) {
        actDiscIds[id - 1] = true;
      }
    });
    console.log(actDiscIds);
    function mapSex(sex: string) {
        sex = sex.toLocaleLowerCase();
        if (sex === "m") return "Männlich";
        if (sex === "w") return "Weiblich";
        if (sex === "d") return "Divers";
    }

  if (athlete === undefined)
    return (
      <div className="p-6 flex flex-col gap-2">
        <Link href="/athletes/" className="flex items-center gap-2">
          <Undo2 />
          <span>Übersicht</span>
        </Link>
        <ErrorDisplay message={`Athlet mit ID: ${id} existiert nicht.`} />
      </div>
    );
  return (
    <div className="p-6 gap-2 flex flex-col">
      <Link href="/athletes/" className="flex items-center gap-2">
        <Undo2 />
        <span>Übersicht</span>
      </Link>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {athlete.firstName} {athlete.lastName}
          </CardTitle>
          <CardDescription>
            {athlete.dateOfBirth.split("-").join(".")} -{" "}
            {getAge(athlete.dateOfBirth)} Jahre
          </CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
      <p>Geburtsdatum: {athlete.dateOfBirth}</p>
      <p>Geschlecht: {mapSex(athlete.sex)}</p>
      <Link href={`/feats_result_page?id=${id}`}>Disziplinen:</Link>
      <div className="m-8 bg-gray-200 rounded-sm shadow-lg">
          <CardTab>
            <div>
            {actDiscIds.map((yes, index) => {
              if (!yes) return null;                        // skip inactive ones

              const disc = disciplines.find(d => d.id === index + 1);
              if (!disc) return null;                       // guard against not found

              return (
                <TabSwitcher key={disc.id} tabId={disc.id}>
                  <div className="p-2">{disc.name}</div>
                </TabSwitcher>
              );
            })}
            </div>
            <div className="p-2">
              {actDiscIds.map((yes, index) => {
                if (!yes) return null;                        // skip inactive ones

                const disc = disciplines.find(d => d.id === index + 1);
                if (!disc) return null;                       // guard against not found

                let relFeats:Feat[]|undefined=feats?.filter(a=>a.ruling?.discipline_id==index+1);
                console.log(relFeats);
                return <div key={disc.id+"_tab"}>
                {relFeats?.map(feat=>{
                  let discName:string|undefined='';
                  if(athlete.sex=='w'){
                     discName=feat.ruling?.description_f;
                  }else{
                     discName=feat.ruling?.description_m;
                  }
                  let tabKey:string;
                  if(discName){
                    tabKey=disc.id+discName;
                  }else{
                    tabKey=disc.id+'_tab';
                  }
                  return (
                    <TabContent key={tabKey} id={disc.id}><details><summary>{discName}</summary>Hier genauere Details über Disziplin/Übung</details></TabContent>
                  );
                })}
                </div>
              })}
            </div>
          </CardTab>
        </div>
      <ul>
        {athlete.disciplines?.map((discipline) => {
          return <li key={discipline}>{discipline}</li>;
        })}
      </ul>
    </div>
  );
}
