import { FetchView, Breadcrumbs, One, FieldType, TypedField, usePreventLeave } from "react-declarative";

import fetchApi from "../../helpers/fetchApi";
import history from "../../helpers/history";

import ITodoItem from "../../model/ITodoItem";
import Star from "@mui/icons-material/Star";

interface ITodoOnePageProps {
  id: string;
}

function setDescription(element: HTMLElement | undefined | null, defaultVal: string = ""): void {
  const descr: HTMLParagraphElement | null | undefined = element?.querySelector("p");
  const elemValue: string | null | undefined = element?.querySelector("input")?.value;

  if (elemValue && descr && !isNaN(+elemValue)) {
    descr.innerHTML = Math.floor(+elemValue / 796.8809523809524).toString();
    return;
  }
  if (descr && elemValue) {
    descr.innerHTML = elemValue;
  } else if (descr) {
    descr.innerHTML = defaultVal;
  }
}

const alphabetList = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

let keywordDisabled = false;

/* ===== Content ===== */

const fields: TypedField[] = [
  {
    type: FieldType.Div,
    style: {
      padding: "0 100px",
    },
    fields: [
      {
        type: FieldType.Div,
        style: {
          display: "grid",
          gridTemplateColumns: "200px auto",
          columnGap: "10px",
        },
        fields: [
          {
            type: FieldType.Div,
            style: {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            },
            fields: [
              {
                type: FieldType.Div,
                style: {
                  background: "#383838",
                  width: "100%",
                  height: "100%",
                  marginBottom: "10px",
                },
              },
              {
                type: FieldType.Div,
                fields: [
                  {
                    type: FieldType.Rating,
                  },
                ],
              },
            ],
          },

          {
            type: FieldType.Div,
            fields: [
              {
                type: FieldType.Line,
                title: "Профиль",
              },
              {
                type: FieldType.Combo,
                placeholder: "Пол",
                itemList: ["Mr.", "Ms.", "Mrs.", "Miss"],
                name: "prefix",
              },
              {
                type: FieldType.Items,
                placeholder: "Списки",
                itemList: [...alphabetList, ...alphabetList.map((e) => e.toUpperCase()), "."],
                name: "suffix",
              },
              {
                type: FieldType.Div,
                style: {
                  display: "flex",
                  alignItems: "center",
                },
                fields: [
                  {
                    type: FieldType.Text,
                    name: "keyword",
                    title: "Кодовая фраза",
                    outlined: false,
                  },
                  {
                    type: FieldType.Checkbox,
                    title: "Кодовая фраза",
                    focus() {
                      keywordDisabled = !keywordDisabled;
                      const d = document.querySelector('input[name="keyword"]');
                      if (keywordDisabled && d) {
                        d.className =
                          "MuiInputBase-input MuiInput-input Mui-disabled Mui-readOnly mui-ume8vi-MuiInputBase-input-MuiInput-input";
                        d.setAttribute("readonly", "");
                        d.setAttribute("disabled", "");
                      } else {
                        if (d) {
                          d.className = "MuiInputBase-input MuiInput-input mui-ume8vi-MuiInputBase-input-MuiInput-input";
                          d.removeAttribute("readonly");
                          d.removeAttribute("disabled");
                        }
                      }
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      //
      { type: FieldType.Line, title: "Общая информация" },
      {
        type: FieldType.Div,
        fields: [
          {
            type: FieldType.Text,
            name: "firstName",
            title: "Имя",
            description: " ",
            groupRef(element) {
              setDescription(element, "Имя");
            },
          },
          {
            type: FieldType.Text,
            name: "lastName",
            title: "Фамилия",
            description: " ",
            groupRef(element) {
              setDescription(element, "Фамилия");
            },
          },
          {
            type: FieldType.Text,
            name: "age",
            title: "Возраст",
            description: " ",
            inputType: "number",
            groupRef(element) {
              setDescription(element, "Возраст");
            },
          },
        ],
      },

      {
        type: FieldType.Expansion,
        title: "Подписка",
        description: "Подписка на уведомления",
        fields: [
          { type: FieldType.Checkbox, name: "subscribed", title: "Получать уведомления" },
          { type: FieldType.Text, name: "phonenumber", title: "Номер телефона" },
          { type: FieldType.Text, name: "email", title: "Email", inputType: "email" },
        ],
      },

      {
        type: FieldType.Div,
        style: {
          display: "grid",
          gridAutoFlow: "column",
        },
        fields: [
          {
            type: FieldType.Div,
            fields: [
              {
                type: FieldType.Line,
                title: "Работа",
              },
              {
                type: FieldType.Text,
                name: "jobTitle",
                title: "Должность",
              },
              {
                type: FieldType.Text,
                name: "jobArea",
                title: "Место работы",
              },
            ],
          },
          //
          {
            type: FieldType.Div,
            fields: [
              {
                type: FieldType.Line,
                title: "Домашний адрес",
              },
              {
                type: FieldType.Text,
                name: "country",
                title: "Страна",
              },
              {
                type: FieldType.Text,
                name: "city",
                title: "Город",
              },
              {
                type: FieldType.Text,
                name: "state",
                title: "Область",
              },
              {
                type: FieldType.Text,
                name: "address",
                title: "Адрес",
              },
            ],
          },
        ],
      },
    ],
  },
];

/* ===== Content End ===== */

export const TodoOnePage = ({ id }: ITodoOnePageProps) => {
  const fetchState = () => [fetchApi<ITodoItem>(`http://localhost:8080/users/${id}`)] as const;

  const Content = (props: any) => {
    const { data, oneProps, beginSave } = usePreventLeave({
      history,
      onSave: () => {
        alert(JSON.stringify(data, null, 2));
        return true;
      },
    });

    return (
      <>
        <Breadcrumbs
          withSave
          title="Список профилей"
          subtitle="Профиль"
          onSave={beginSave}
          onBack={() => history.push("/todos_list")}
          saveDisabled={!data}
        />
        <One<ITodoItem> handler={() => props.todo} fields={fields} {...oneProps} />
      </>
    );
  };

  return <FetchView state={fetchState}>{(todo) => <Content todo={todo} />}</FetchView>;
};

export default TodoOnePage;
