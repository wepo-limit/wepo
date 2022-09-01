import { curUserState, IAward } from "@/atoms";
import { useState } from "react";
import AwardEditForm from "./AwardEditForm";
import AwardAddForm from "./AwardAddForm";
import { useLocation, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import * as AwardStyled from "@styledComponents/CategoryStyled";
import { PlusSquareFill } from "styled-icons/bootstrap";
import { Pencil } from "styled-icons/boxicons-solid";
import { Trash2 } from "styled-icons/feather";
import { Category, deleteData, mutationCategory } from "@api/api";
import { Draggable, Droppable, DropResult } from "@hello-pangea/dnd";

interface IAwardProps {
    awards: IAward[];
    setAwards: React.Dispatch<React.SetStateAction<IAward[]>>;
}

export default function Award({ awards, setAwards }: IAwardProps) {
    // 현재 로그인 유저
    const curUser = useRecoilValue(curUserState);

    // form관리
    const [isAddFormActive, setIsAddFormActive] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [targetIndex, setTargetIndex] = useState<Number | null>();
    const newDate = new Date();
    const maxDate = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(
        2,
        "0"
    )}-${String(newDate.getDate()).padStart(2, "0")}`;

    //parmas
    const { userSeq } = useParams();
    //현재경로
    const location = useLocation();
    const pathName = location.pathname;

    //권한관리
    const compareUser = userSeq && parseInt(userSeq) === curUser?.userId!;
    const inMyPage = pathName === "/mypage";
    const admin = inMyPage || compareUser;

    // 삭제버튼 클릭시
    const onClickDeleteBtn = (award: IAward, index: number) => {
        const userId = award.userId!;
        const awardId = award.awardId!;
        deleteData(Category.award, awardId, userId);
        setAwards((prev) => {
            const newAwards = [...prev];
            newAwards.splice(index, 1);
            return newAwards;
        });
    };

    //추가버튼 클릭시 버튼 활성화 on/off
    function handleIsAddFormActive() {
        setIsAddFormActive((current) => !current);
    }
    // console.log("유저시퀀스", userSeq);
    // console.log("compareUser", compareUser);
    // console.log("inMyPage", inMyPage);
    // console.log("admin", admin);

    return (
        <Droppable droppableId="awards" isDropDisabled={admin ? false : true}>
            {(magic) => (
                <div ref={magic.innerRef} {...magic.droppableProps}>
                    <AwardStyled.Container>
                        <AwardStyled.TitleBox>
                            <AwardStyled.Title>수상경력</AwardStyled.Title>
                        </AwardStyled.TitleBox>
                        <AwardStyled.ContentContainer>
                            {isAddFormActive && (
                                <AwardAddForm
                                    setAwards={setAwards}
                                    maxDate={maxDate}
                                    setIsAddFormActive={setIsAddFormActive}
                                    userId={curUser?.userId!}
                                    awards={awards}
                                />
                            )}
                            {!isAddFormActive &&
                                awards?.map((award, index) => (
                                    <Draggable
                                        key={String(award?.awardId!)}
                                        draggableId={String(award?.awardId!)}
                                        index={index}
                                    >
                                        {(magic) => (
                                            <AwardStyled.ContentBox key={index}>
                                                {targetIndex !== index && (
                                                    <div
                                                        ref={magic.innerRef}
                                                        {...magic.draggableProps}
                                                        {...magic.dragHandleProps}
                                                    >
                                                        <div
                                                            style={{
                                                                width: "80%",
                                                                display: "flex",
                                                                alignItems: "center",
                                                            }}
                                                        >
                                                            <AwardStyled.ContentAccent
                                                                title={award.title}
                                                            >
                                                                {award.title}
                                                            </AwardStyled.ContentAccent>
                                                            <AwardStyled.ContentDetail
                                                                style={{
                                                                    color: "#797979",
                                                                    marginBottom: "20px",
                                                                    marginLeft: "20px",
                                                                }}
                                                                title={award.grade}
                                                            >
                                                                {award.grade}
                                                            </AwardStyled.ContentDetail>
                                                        </div>
                                                        <AwardStyled.ContentDetail
                                                            title={award.org}
                                                        >
                                                            {award.org}
                                                        </AwardStyled.ContentDetail>
                                                        <AwardStyled.ContentDate>
                                                            {String(award.date).slice(0, 10)}
                                                        </AwardStyled.ContentDate>
                                                        <AwardStyled.ContentDesc
                                                            title={award.description}
                                                        >
                                                            {award.description}
                                                        </AwardStyled.ContentDesc>
                                                        {curUser && admin && targetIndex !== index && (
                                                            <>
                                                                <AwardStyled.EditButton
                                                                    onClick={() => {
                                                                        setIsEditing(true);
                                                                        setTargetIndex(index);
                                                                    }}
                                                                >
                                                                    <Pencil color="#3867FF" />
                                                                </AwardStyled.EditButton>
                                                                <AwardStyled.DeleteButton
                                                                    onClick={() => {
                                                                        onClickDeleteBtn(
                                                                            award,
                                                                            index
                                                                        );
                                                                    }}
                                                                >
                                                                    <Trash2 color="#3867FF" />
                                                                </AwardStyled.DeleteButton>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                                {isEditing && targetIndex === index && (
                                                    <AwardEditForm
                                                        index={index}
                                                        awards={awards}
                                                        setAwards={setAwards}
                                                        setIsEditing={setIsEditing}
                                                        maxDate={maxDate}
                                                        awardId={award?.awardId!}
                                                        userId={award?.userId!}
                                                        setTargetIndex={setTargetIndex}
                                                    />
                                                )}
                                            </AwardStyled.ContentBox>
                                        )}
                                    </Draggable>
                                ))}
                        </AwardStyled.ContentContainer>
                        {magic.placeholder}

                        {curUser && admin && !isAddFormActive && (
                            <AwardStyled.AddButton onClick={handleIsAddFormActive}>
                                <PlusSquareFill color="#3687FF" />
                            </AwardStyled.AddButton>
                        )}
                    </AwardStyled.Container>
                </div>
            )}
        </Droppable>
    );
}
