import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { GameObject, Transform, Quaternion, Vector3 } from "UnityEngine";
import { Button, InputField, Slider } from "UnityEngine.UI";

export default class UIEvent extends ZepetoScriptBehaviour {
    public cubeTransform: Transform;
    public sliderUI: Slider;
    public cubePrefab: GameObject;
    public inputFieldUI: InputField;
    public createBtn: Button;
    public deleteBtn: Button;
    public cubeArray: GameObject[]; // 타입을 GameObject[]로 명시
    private canvasTransform: Transform; // Canvas의 Transform을 저장할 변수 선언

    Start() {
        // Canvas 오브젝트 찾기 및 Transform 참조 저장
        this.canvasTransform = GameObject.Find("Canvas").GetComponent<Transform>();

        this.sliderUI.maxValue = 180;
        this.sliderUI.onValueChanged.AddListener((v) => {
            this.cubeTransform.rotation = Quaternion.Euler(0, v, 0);
        });

        this.cubeArray = [];
        this.createBtn.onClick.AddListener(() => {
            this.TextBoxCreate();
        });
        this.deleteBtn.onClick.AddListener(() => {
            this.CubeDeleteAll();
        });
    }

    TextBoxCreate() {
        var createCnt = Number(this.inputFieldUI.text);

        if (isNaN(createCnt) || createCnt <= 0) {
            return;
        }

        this.CubeDeleteAll();

        for (var i = 0; i < createCnt; ++i) {
            let textBoxObj = GameObject.Instantiate(this.inputFieldUI.gameObject, new Vector3(i * 100, -3.5, 0), Quaternion.identity) as GameObject;
            textBoxObj.name = "InputField_" + i;

            // Canvas의 자식으로 설정
            textBoxObj.transform.SetParent(this.canvasTransform, false);

            // Set the text content of the textbox to empty
            let textComponent = textBoxObj.GetComponentInChildren(Text);
            textComponent.text = "";

            this.cubeArray.push(textBoxObj);
        }
    }

    CubeDeleteAll() {
        for (let obj of this.cubeArray) {
            GameObject.Destroy(obj);
        }
        this.cubeArray = [];
    }
}
