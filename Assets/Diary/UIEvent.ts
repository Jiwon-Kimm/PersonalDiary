import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { GameObject, Transform, Quaternion, Vector3, Object } from "UnityEngine";
import { Button, InputField, Slider } from "UnityEngine.UI";

export default class UIEvent extends ZepetoScriptBehaviour {
    // 기존 변수들 유지
    public cubeTransform: Transform;
    public sliderUI: Slider;
    public cubePrefab: GameObject; // 참조 유지
    public inputFieldUI: InputField;
    public createBtn: Button;
    public deleteBtn: Button;
    public cubeArray: Object[]; // 텍스트 박스 배열로 사용될 예정

    Start() {
        // 슬라이더 코드 유지
        this.sliderUI.maxValue = 180;
        this.sliderUI.onValueChanged.AddListener((v) => {
            this.cubeTransform.rotation = Quaternion.Euler(0, v, 0);
        });

        // InputField & Button 코드 수정
        this.cubeArray = [];
        this.createBtn.onClick.AddListener(() => {
            this.TextBoxCreate(); // 큐브 생성 대신 텍스트 박스 생성 함수 호출
        });
        this.deleteBtn.onClick.AddListener(() => {
            this.CubeDeleteAll(); // 모든 텍스트 박스 삭제
        });
    }

    TextBoxCreate() {
        var createCnt = Number(this.inputFieldUI.text);

        // 예외 처리
        if (isNaN(createCnt) || createCnt == 0) {
            return;
        }

        // 모든 텍스트 박스 삭제
        this.CubeDeleteAll();

        // 텍스트 박스 생성
        for (var i = 0; i < createCnt; ++i) {
            var textBoxObj = GameObject.Instantiate(this.inputFieldUI.gameObject, new Vector3(i * 1.5, -3.5, 0), Quaternion.identity);
            // 고유한 이름 설정
            textBoxObj.name = "InputField_" + i;
            this.cubeArray.push(textBoxObj);
        }
    }

    CubeDeleteAll() {
        // 모든 텍스트 박스 삭제
        for (var i = 0; i < this.cubeArray.length; ++i) {
            GameObject.Destroy(this.cubeArray[i]);
        }
        this.cubeArray = [];
    }
}
