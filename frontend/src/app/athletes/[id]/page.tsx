import { useParams } from "next/navigation";
import { Athlete, Feat } from "@/models/athlete";
import { getAllDisciplines, getAthleteById, getFeatsById, getAthleteWithFeats} from "@/athlete_getters";
import {downloadCsv } from "@/exportCsv";
import DownloadCsvButton from "@/components/ui/csvExportButton";
import Link from "next/link";
import { Undo2, CircleUserRound, Medal, CircleSlash } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

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

function MedalDisplay({ displayName, type }: { displayName: string, type: "gold" | "silver" | "bronze" | "none" }) {
  const size = "40"
  const text_size = "text-xl"
  if (type === "gold") return (
    <Badge className="bg-yellow-300 text-yellow-900 flex grow gap-2 pointer-events-none">
      <Medal size={size} strokeWidth={1.5} /> <span className={`${text_size}`}>{displayName}</span>
    </Badge>
  )
  if (type === "bronze") return (
    <Badge className="bg-orange-300 text-orange-900 flex grow gap-2 pointer-events-none">
      <Medal size={size} strokeWidth={1.5} /> <span className={`${text_size}`}>{displayName}</span>
    </Badge>
  )
  if (type === "silver") return (
    <Badge className="bg-gray-300 text-gray-800 flex grow gap-2 pointer-events-none">
      <Medal size={size} strokeWidth={1.5} /> <span className={`${text_size}`}>{displayName}</span>
    </Badge>
  )
  if (type === "none") return (
    <Badge className="bg-gray-100 text-neutral-500 flex grow gap-2 pointer-events-none">
      <CircleSlash size={size} strokeWidth={1}/> <span className={`${text_size}`}>{displayName}</span>
    </Badge>
  )
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
    const id = parseInt((await params).id);
    const athlete = await getAthleteById(id);
    const feats= await getFeatsById(id);
    const disciplines= await getAllDisciplines();
    let actDiscIds:boolean[]=[false, false, false, false];
    feats?.forEach(feat => {
      // first, safely pull out discipline_id
      const id = feat?.ruling?.discipline_id;
    
      // make sure it's a real number in [1..4]
      if (typeof id === "number" && id >= 1 && id <= actDiscIds.length) {
        actDiscIds[id - 1] = true;
      }
    });
    function mapSex(sex: string) {
        sex = sex.toLocaleLowerCase();
        if (sex === "m") return "Männlich";
        if (sex === "w") return "Weiblich";
        if (sex === "d") return "Divers";
    }
   let usedExercises:number[]=[];
   let idIndex=1;
   let temp:number;
   let tabMap:number[]=[];

  if (athlete === undefined)
    return (
      <div className="p-6 flex flex-col gap-2">
        <Link href="/athletes/" className="flex items-center gap-2">
          <Undo2 />
          <span className="underline">Übersicht</span>
        </Link>
        <ErrorDisplay message={`Athlet mit ID: ${id} existiert nicht.`} />
      </div>
    );

  return (
    <div className="p-6 gap-4 flex flex-col">

      <Link href="/athletes/" className="flex items-center gap-2">
        <Undo2 />
        <span className="underline">Übersicht</span>
      </Link>

      <Card>
        <CardContent className="mt-5 flex gap-2 items-center">

          <CircleUserRound size="69" strokeWidth={0.5} />

          <div>
            <span className="text-xl font-bold">
              {athlete.firstName} {athlete.lastName}
            </span>
            <div>
              {athlete.dateOfBirth.split("-").join(".")} - {" "}
              {getAge(athlete.dateOfBirth)} Jahre
            </div>
            <div className="text-gray-500">
              <p>{mapSex(athlete.sex)}</p>
            </div>
          </div>

          <div className="pl-7 grow gap-1 xl:gap-7 flex justify-evenly items-center">
            <MedalDisplay displayName="Kraft" type="gold"/>
            <MedalDisplay displayName="Koordination" type="none"/>
            <MedalDisplay displayName="Ausdauer" type="silver"/>
            <MedalDisplay displayName="Schnelligkeit" type="bronze"/>
          </div>
        </CardContent>
      </Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {athlete.firstName} {athlete.lastName}
          </CardTitle>
          <CardDescription>
            {athlete.dateOfBirth.split("-").join(".")} -{" "}
            {getAge(athlete.dateOfBirth)} Jahre
            <DownloadCsvButton ids={[id]} text={"Als Csv exportieren"} />
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
              temp=idIndex;
              idIndex+=1;
              tabMap[disc.id]=temp;
              return (
                <TabSwitcher key={disc.id} tabId={temp}>
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
                return <div key={disc.id+"_tab"}>
                {relFeats?.map(feat=>{
                  if(usedExercises.includes(feat.rule_id)){
                    return null;
                  }else{
                    usedExercises.push(feat.rule_id);
                  }
                  let discName:string|undefined='';
                  if(athlete.sex=='w'){
                     discName=feat.ruling?.description_f;
                  }else{
                     discName=feat.ruling?.description_m;
                  }
                  discName+=" "+feat.ruling?.min_age+" - "+feat.ruling?.max_age;
                  let tabKey:string;
                  if(discName){
                    tabKey=disc.id+discName;
                  }else{
                    tabKey=disc.id+'_tab';
                  }
                  return (
                    <TabContent key={tabKey} id={tabMap[disc.id]}><details><summary>{discName}</summary>Hier genauere Details über Disziplin/Übung</details></TabContent>
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
