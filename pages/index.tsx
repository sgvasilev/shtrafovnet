import type { NextPage } from "next"
import { useState, KeyboardEvent, useMemo } from "react"
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Logo from "../public/logo.png"
import Image from "next/image"
import Loader from "react-loader-spinner"
import Head from "next/head"
import styles from "../styles/Home.module.css"
import validateUIN from "./components/ValidateUIN"

const Home: NextPage = () => {
  const headings = [
    { "Свидетельство о регистрации:": "doc_number" },
    { "Дата постановления:": "bill_at" },
    { "Нарушение:": "koap_code" },
    { "Получатель платежа": "payee_username" },
    { ИНН: "payee_inn" },
    { КПП: "payee_kpp" },
    { "Расчетный счет:": "payee_bank_account" },
    { "Банк получателя:": "payee_bank_name" },
    { "БИК:": "payee_bank_bik" },
    { "ОКТМО(ОКАТО):": "payee_oktmo" },
    { "КБК:": "number" },
    { "Сумма штрафа:": "amount" },
    { "Скидка:": "violation_at" },
  ]

  const validation = useMemo(() => validateUIN, [])
  const [UIN, setUIN] = useState("")
  const [isLoading, setLoading] = useState(false)
  const [data, setData]: any = useState(false)
  const [isError, setError] = useState({
    isError: false,
    errorCode: "",
  })
  const handleMouseEvent = (): void => {
    ;(document.getElementById("UINinput") as HTMLInputElement).value =
      UIN + validateUIN(UIN)
  }

  const handleKeyboardEvent = (event: KeyboardEvent): void => {
    if (event.key === "ArrowDown" || event.key === "Tab") {
      ;(document.getElementById("UINinput") as HTMLInputElement).value =
        UIN + validateUIN(UIN)
    } else if (event.key === "Enter") {
      event.preventDefault()
      fetchShtraf()
    }
  }
  const fetchShtraf = async () => {
    if (UIN.length < 19) return
    const lastUINDigit = `${UIN}${validateUIN(UIN)}`
    setUIN(`${lastUINDigit}`)
    try {
      setLoading(true)
      const response = await fetch(
        `https://test-task.shtrafovnet.com/fines/${lastUINDigit}`
      )

      if (response.ok) {
        const data = await response.json()
        setLoading(false)
        setError({
          isError: false,
          errorCode: "",
        })
        setData(data)
        return
      } else {
        setLoading(false)
        setData("")
        setError({
          isError: true,
          errorCode: response.status.toString(),
        })
      }
    } catch (error) {
      console.log("Что то пошло не так", error)
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>УИН</title>
        <meta name="description" content="App" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main className={styles.main}>
        <div className={styles.main__body}>
          <div style={{ alignSelf: "start", width: "530px", margin: "0 auto" }}>
            <span style={{ top: "7px", position: "relative" }}>
              <Image
                className={styles.logo}
                width="35px"
                height="35px"
                src={Logo}
                alt="logo"
              ></Image>
            </span>
            <strong className={styles.logoText}>Штрафов </strong>
            <span className={styles.logoText}> Нет</span>
            <p>Получение информации о штрафе по УИН</p>
          </div>

          <div className={styles.UINsearchblock}>
            <form>
              <label className={styles.raz}>
                <input
                  onKeyDown={(event) => {
                    handleKeyboardEvent(event)
                  }}
                  id="UINinput"
                  autoFocus={true}
                  className={styles.searchField}
                  placeholder="Введите УИН"
                  onChange={(e) => {
                    setUIN(e.target.value)
                    {
                      isError.isError &&
                        setError({ isError: false, errorCode: "" })
                    }
                    if (UIN.length === (19 || 24)) {
                      document
                        .getElementById("UserHelp")
                        ?.classList.add(styles.visible)
                    }
                    document
                      .getElementById("UserHelp")
                      ?.classList.add(styles.hidden)
                  }}
                />
                <span>Введите 20 или 25 цифр</span>
                <p
                  id="UserHelp"
                  onMouseOver={handleMouseEvent}
                  className={styles.userAutocomplete}
                  style={
                    UIN.length == 24 || UIN.length == 19
                      ? { visibility: "visible" }
                      : { visibility: "hidden" }
                  }
                >
                  {UIN}
                  {validation(UIN)}
                </p>
              </label>
            </form>
            <button className={styles.searchButton} onClick={fetchShtraf}>
              Найти
            </button>
          </div>
          {isLoading ? (
            <div className={styles.main}>
              <Loader
                type="TailSpin"
                color="#00BFFF"
                height={100}
                width={100}
              />
              <p>Загрузка</p>
            </div>
          ) : (
            ""
          )}
          {isError.errorCode == "500" ? (
            <h3>Ошибка сервера {isError.errorCode}</h3>
          ) : isError.errorCode == "404" ? (
            `Штраф ${UIN}${validateUIN(UIN)} не найден`
          ) : (
            isError.errorCode
          )}
          {data && (
            <div className={styles.shtrafData}>
              <table className={styles.wrapper}>
                <caption>
                  <h2 className={styles.heading}>
                    Постановление #{data.number}
                  </h2>
                </caption>
                <tbody className={styles.wrapper}>
                  {headings.map((el) => {
                    var header = Object.keys(el)
                    var source: any = Object.values(el).toString()
                    for (let i = 0; i < header.length; i++) {
                      return (
                        <tr key={source}>
                          <td className={styles.text_1stcolumn}>{header[i]}</td>
                          <td className={styles.text_2ndcolumn}>
                            {source == "bill_at" || source == "violation_at"
                              ? data[source]?.split("T", 1)
                              : data[source]}
                          </td>
                        </tr>
                      )
                    }
                  })}
                  <tr>
                    <td className={styles.text_1stcolumn}>К оплате</td>
                    <td className={styles.text_2ndcolumn}>
                      {new Intl.NumberFormat("ru-RU", {
                        style: "currency",
                        currency: "RUB",
                      }).format(data.amount / 2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Home
