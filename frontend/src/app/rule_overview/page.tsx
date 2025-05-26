"use client"

import { useParams } from "next/navigation";
import { Rule } from "@/models/athlete";
import { getAllRules} from "@/athlete_getters";
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
import { useState, useEffect } from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
const {
  Root: DropdownMenu,
  Trigger: DropdownMenuTrigger,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
  ItemIndicator: DropdownMenuItemIndicator,
  RadioGroup: DropdownMenuRadioGroup,
  RadioItem: DropdownMenuRadioItem,
} = DropdownMenuPrimitive
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as Tooltip from "@radix-ui/react-tooltip";

function parseAgegroup(groupString:string):number[]{
  let stringGroup:string[]=groupString.split(',');
  let ageGroup:number[]=[Number(stringGroup[0]), Number(stringGroup[1])];
  return ageGroup;

}


export default function Page() {
      const [ageGroup, setAgeGroup] = useState<string>()
      const [rules, setRules] = useState<Rule[]>()
      const [error, setError] = useState<string | null>(null);
      useEffect(() => {
        getAllRules()
          .then((data) => setRules(data))
          .catch((err) => setError(err.message));
      }, []);
      if (error) return <div className="text-red-600">Failed to load: {error}</div>;
      if (!rules) return <div>Loading disciplines…</div>;
      console.log(rules);
      //let validRules=rules.filter(rule=>{return isCurrentDateBetween(rule.valid_start, rule.valid_end)});
      //console.log(validRules)
      
    return (
      <div className="p-6 gap-4 flex flex-col"> 
      <h1 className="text-2x1 font bold mb-4">Regel-Übersicht</h1>     
        <DropdownMenu>
      {/* Trigger: here we put a button that shows the current selection */}
      <Tooltip.Root>
  <Tooltip.Trigger asChild>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "inline-flex items-center justify-between rounded border px-3 py-1.5 text-sm",
            !ageGroup ? "text-gray-500" : "text-gray-900"
          )}
        >
          {/* show placeholder when nothing’s selected */}
          {ageGroup ?? "Wählen sie eine Altersgruppe"}
          <ChevronDown className="ml-2 h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      </Tooltip.Trigger>
  <Tooltip.Content
    side="top" // Tooltip wird rechts angezeigt
    align="center" // Zentriert den Tooltip vertikal zur Maus
    sideOffset={10} // Abstand zwischen Tooltip und Maus
    className="bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-md max-w-xs break-words"
  >
    Wählen sie die Altersgruppe, für welche Regelungen angezeigt werden sollen
    <Tooltip.Arrow className="fill-gray-800" />
  </Tooltip.Content>
</Tooltip.Root>

      {/* Content: your dropdown panel */}
      <DropdownMenuContent sideOffset={4} className="z-50 min-w-[8rem] rounded-md border bg-white p-1 shadow-md">
        {/* Using the radio-group approach so it keeps track of the selected value */}
        <DropdownMenuRadioGroup value={ageGroup} onValueChange={setAgeGroup}>

          <DropdownMenuRadioItem value="6,7">
            6-7
            {/* this indicator only shows on the selected item */}
            <DropdownMenuItemIndicator>
              <Check className="h-4 w-4" />
            </DropdownMenuItemIndicator>
          </DropdownMenuRadioItem>

          <DropdownMenuRadioItem value="8,9">
            8-9
            <DropdownMenuItemIndicator>
              <Check className="h-4 w-4" />
            </DropdownMenuItemIndicator>
          </DropdownMenuRadioItem>

          <DropdownMenuRadioItem value="10,11">
            10-11
            <DropdownMenuItemIndicator>
              <Check className="h-4 w-4" />
            </DropdownMenuItemIndicator>
          </DropdownMenuRadioItem>

          <DropdownMenuRadioItem value="12,13">
            12-13
            <DropdownMenuItemIndicator>
              <Check className="h-4 w-4" />
            </DropdownMenuItemIndicator>
          </DropdownMenuRadioItem>

          <DropdownMenuRadioItem value="14,15">
            14-15
            <DropdownMenuItemIndicator>
              <Check className="h-4 w-4" />
            </DropdownMenuItemIndicator>
          </DropdownMenuRadioItem>

          <DropdownMenuRadioItem value="16,17">
            16-17
            <DropdownMenuItemIndicator>
              <Check className="h-4 w-4" />
            </DropdownMenuItemIndicator>
          </DropdownMenuRadioItem>

        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
          <Tabs defaultValue={'1'} className="w-full">
          <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <TabsList>
              <TabsTrigger key={'m'} value={'1'}>
                M
              </TabsTrigger>
              <TabsTrigger key={'f'} value={'2'}>
                F
              </TabsTrigger>
            </TabsList>
            </Tooltip.Trigger>
            <Tooltip.Content
              side="right" // Tooltip wird rechts angezeigt
              align="center" // Zentriert den Tooltip vertikal zur Maus
              sideOffset={10} // Abstand zwischen Tooltip und Maus
              className="bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-md max-w-xs break-words"
            >
              Wechsel Regelungen männlich/weiblich
              <Tooltip.Arrow className="fill-gray-800" />
            </Tooltip.Content>
          </Tooltip.Root>
                <div>
                <TabsContent key={"m"} value={"1"}>
                <Card>
                  <CardContent>
                    <Accordion type="single" collapsible>
                    {
                        rules.map(rule=>{
                          let currAgeGroup:number[]=parseAgegroup(ageGroup??'0,0');
                          if(rule.min_age==currAgeGroup[0]&&rule.max_age==currAgeGroup[1]){
                            return (
                              <AccordionItem key={rule.description_m} value={rule.description_m}>
                                <AccordionTrigger>{rule.description_m}</AccordionTrigger>
                                <AccordionContent>
                                      <ul>
                                        <li>Gold: {rule.thresh_gold_m} {rule.unit}</li>
                                        <li>Silber: {rule.thresh_silver_m} {rule.unit}</li>
                                        <li>Bronze: {rule.thresh_bronze_m} {rule.unit}</li>
                                      </ul>
                                </AccordionContent>
                              </AccordionItem>
                            );
                          }else{
                            return null;
                          }
                        })
                    }
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
                <TabsContent key={"f"} value={"2"}>
                <Card>
                  <CardContent>
                    <Accordion type="single" collapsible>
                    {
                        rules.map(rule=>{
                          let currAgeGroup:number[]=parseAgegroup(ageGroup??'0,0');
                          if(rule.min_age==currAgeGroup[0]&&rule.max_age==currAgeGroup[1]){
                            return (
                              <AccordionItem key={rule.description_f} value={rule.description_f}>
                                <AccordionTrigger>{rule.description_f}</AccordionTrigger>
                                <AccordionContent>
                                      <ul>
                                        <li>Gold: {rule.thresh_gold_f} {rule.unit}</li>
                                        <li>Silber: {rule.thresh_silver_f} {rule.unit}</li>
                                        <li>Bronze: {rule.thresh_bronze_f} {rule.unit}</li>
                                      </ul>
                                </AccordionContent>
                              </AccordionItem>
                            );
                          }else{
                            return null;
                          }
                        })
                    }
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
                </div>
              
            </Tabs>
          </div>
    );
  }