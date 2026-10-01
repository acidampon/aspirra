export function createStarterPlan(goalText){return{title:goalText.trim(),description:"A practical first plan generated from your goal.",actions:[
{id:crypto.randomUUID(),title:"Define the outcome",detail:"Write down what success will look like and how you will measure it.",done:false},
{id:crypto.randomUUID(),title:"Choose the next milestone",detail:"Pick one milestone that can be reached within the next 7 days.",done:false},
{id:crypto.randomUUID(),title:"Take the first concrete step",detail:"Do one action today that creates visible progress.",done:false}
]}}