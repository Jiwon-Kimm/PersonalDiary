import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { GameObject, Transform, Quaternion, Vector3 } from "UnityEngine";
import { Button, InputField, Slider } from "UnityEngine.UI";

export default class UIEvent extends ZepetoScriptBehaviour {
    public cubeTransform: Transform;
    public sliderUI: Slider;
    public cubePrefab: GameObject;
    public inputFieldUI: InputField;
    public createBtn: Button;
    public deleteBtn: Button;
    public cubeArray: GameObject[] = []; // 초기화를 여기서 직접 해줍니다.
    private canvasTransform: Transform;
    private textBoxCount: number = 0; // textBox의 총 개수를 추적하는 변수를 추가합니다.

    Start() {
        this.canvasTransform = GameObject.Find("Canvas").GetComponent<Transform>();

        this.sliderUI.maxValue = 180;
        this.sliderUI.onValueChanged.AddListener((v) => {
            this.cubeTransform.rotation = Quaternion.Euler(0, v, 0);
        });

        this.createBtn.onClick.AddListener(() => {
            this.TextBoxCreate();
        });
        this.deleteBtn.onClick.AddListener(() => {
            this.CubeDeleteAll();
        });
    }

    TextBoxCreate() {
        let createCnt = Number(this.inputFieldUI.text);

        if (isNaN(createCnt) || createCnt <= 0) {
            return;
        }

        // 기존에 생성된 textBox가 사라지지 않고, 새로운 textBox가 추가되도록 수정합니다.
        for (let i = this.textBoxCount; i < this.textBoxCount + createCnt; ++i) {
            let textBoxObj = GameObject.Instantiate(this.inputFieldUI.gameObject, new Vector3(-330 + i * 150, 215 - i * 50, 0), Quaternion.identity) as GameObject;
            textBoxObj.name = `InputField_${i}`;
            textBoxObj.transform.SetParent(this.canvasTransform, false);
            this.cubeArray.push(textBoxObj);
        }

        // textBoxCount를 업데이트합니다.
        this.textBoxCount += createCnt;
    }

    CubeDeleteAll() {
        for (let obj of this.cubeArray) {
            GameObject.Destroy(obj);
        }
        this.cubeArray = [];
        this.textBoxCount = 0; // CubeDeleteAll이 호출될 때 textBoxCount를 리셋합니다.
    }
}