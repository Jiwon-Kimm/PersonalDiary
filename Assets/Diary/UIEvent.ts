import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { GameObject, Transform, Quaternion, Vector3, Object } from "UnityEngine";
import { Button, InputField, Slider } from "UnityEngine.UI";

export default class UIEvent extends ZepetoScriptBehaviour {
    // ���� ������ ����
    public cubeTransform: Transform;
    public sliderUI: Slider;
    public cubePrefab: GameObject; // ���� ����
    public inputFieldUI: InputField;
    public createBtn: Button;
    public deleteBtn: Button;
    public cubeArray: Object[]; // �ؽ�Ʈ �ڽ� �迭�� ���� ����

    Start() {
        // �����̴� �ڵ� ����
        this.sliderUI.maxValue = 180;
        this.sliderUI.onValueChanged.AddListener((v) => {
            this.cubeTransform.rotation = Quaternion.Euler(0, v, 0);
        });

        // InputField & Button �ڵ� ����
        this.cubeArray = [];
        this.createBtn.onClick.AddListener(() => {
            this.TextBoxCreate(); // ť�� ���� ��� �ؽ�Ʈ �ڽ� ���� �Լ� ȣ��
        });
        this.deleteBtn.onClick.AddListener(() => {
            this.CubeDeleteAll(); // ��� �ؽ�Ʈ �ڽ� ����
        });
    }

    TextBoxCreate() {
        var createCnt = Number(this.inputFieldUI.text);

        // ���� ó��
        if (isNaN(createCnt) || createCnt == 0) {
            return;
        }

        // ��� �ؽ�Ʈ �ڽ� ����
        this.CubeDeleteAll();

        // �ؽ�Ʈ �ڽ� ����
        for (var i = 0; i < createCnt; ++i) {
            var textBoxObj = GameObject.Instantiate(this.inputFieldUI.gameObject, new Vector3(i * 1.5, -3.5, 0), Quaternion.identity);
            // ������ �̸� ����
            textBoxObj.name = "InputField_" + i;
            this.cubeArray.push(textBoxObj);
        }
    }

    CubeDeleteAll() {
        // ��� �ؽ�Ʈ �ڽ� ����
        for (var i = 0; i < this.cubeArray.length; ++i) {
            GameObject.Destroy(this.cubeArray[i]);
        }
        this.cubeArray = [];
    }
}
