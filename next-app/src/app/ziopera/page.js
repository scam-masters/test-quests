"use client"
import { db, app } from "@/firebase/index";
import { doc, getDoc, getDocs, setDoc, query, collection, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function ZioPera({ }) {
	(async function () {
		const docRef = doc(db, "exercises", "mission_8");
		const myDoc = await getDoc(docRef)
		const data = myDoc.data()
		console.log(data)
		data.text = `
class Student:
    def __init__(self, name, exam_marks):
       self.name = name
       self.exam_marks = exam_marks
       self.calc = Calculater()

    def calculate_average_score(self):
       total_score = 0
       idx = 0
       for idx, mark in enumerate(exam_marks):
           total_score += marks
       average_score = self.calc.divide(total_score, idx)
       return average_score

exam_scores = [25, 30, 30, 22]
student1 = Student("Alice", exam_scores)
average_score = student1.calculate_average_score()

print(f"{student1.name}'s average score is: {average_score}")`
		await setDoc(docRef, data);
	})();

	return (<></>)
}


