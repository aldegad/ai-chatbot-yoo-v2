"use client"

import { apiClient } from "@apiClient"
import { useErrorCatch } from "@components/useErrorCatch"
import createStyle from "@local_modules/theme/createStyle"
import { formatDate } from "@local_modules/formatDate"
import Div from "@local_modules/tags/Div"
import { borderRadius, color } from "@theme/index"
import { ICharacter, IChatRoom } from "@type"
import { useEffect, useState } from "react"
import Button from "@local_modules/tags/Button"
import useRouter from "@local_modules/router/useRouter"
import { IconAccessibilityOutline, IconTrashOutline } from "@components/images"
import { ElementClickEvent } from "@local_modules/tags/type"
import useModalCreateRoom from "@app/character/components/useModalCreateChatRoom"
import H2 from "@local_modules/tags/H2"

export default function MyCharacterList() {
  const router = useRouter()
  const { createErrorCatch } = useErrorCatch()
  const { createChatRoom } = useModalCreateRoom()

  const [myCharacterList, setMyCharacterList] = useState<ICharacter.MineResponse>({ list: [], length: 0 })

  useEffect(() => {
    setCharacterList();
  }, [])

  const setCharacterList = async() => {
    try {
      const { data } = await apiClient.character.mine({ visibility: 'ALL' })
      setMyCharacterList(data)
    } catch(error) {
      createErrorCatch(error)
    }
  }

  const onViewCharacter = (e:ElementClickEvent, _id:ICharacter.Model['_id']) => {
    e.instance.stop()

    // modal Open
  }

  const onDeleteCharacter = async(e:ElementClickEvent, _id:ICharacter.Model['_id']) => {
    e.instance.stop()

    try {
      const { data } = await apiClient.character.delete({ characterId: _id })
      setCharacterList()
      alert(data.message)
    } catch(error) {
      createErrorCatch(error)
    }
  }

  const onNavToChat = async(_id:ICharacter.Model['_id']) => {
    // createChatRoom
    const chatRoom = (await createChatRoom({ characterId: _id })).present()
    // router.push(`/chat/${_id}`)
  }

  return (
    <Div style={styles.list}>
      <H2>내 캐릭터</H2>
      {
        myCharacterList.list.map(character => (
          <Button 
            key={String(character._id)} 
            style={styles.item} 
            onClick={() => onNavToChat(character._id)}>
            <Div style={styles.titleRow}>
              <H2 style={styles.name}>{character.name}</H2>
              <Div style={styles.buttonRow}>
                <Button style={styles.button} onClick={(e) => onViewCharacter(e, character._id)}>
                  <IconAccessibilityOutline color={color.primary} width={16} height={16}/>
                </Button>
                <Button style={styles.button} onClick={(e) => onDeleteCharacter(e, character._id)}>
                  <IconTrashOutline color={color.primary} width={16} height={16}/>
                </Button>
              </Div>
            </Div>
            <Div>{character.system}</Div>
            <Div style={styles.createAt}>{formatDate(character.createdAt)}</Div>
          </Button>
        ))
      }
    </Div>
  )
}

const styles = createStyle({
  list: {
    rowGap: 12
  },
  item: {
    backgroundColor: 'white',
    borderRadius: borderRadius.base,
    padding: '12 14',
    rowGap: 8,
    textAlign: 'left'
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  name: {
    fontSize: 18,
    fontWeight: 600,
    flex: 1,
    color: color.primary
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8
  },
  button: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0
  },
  createAt: {
    fontSize: 12,
    color: color.gray,
    textAlign: 'right'
  }
})
