import { useState } from "react";
import { Button, CommonModal, Select } from "../Controls";
import { fetchWithAuth } from "@/utils/auth/tokenUtils";

export default function ReportModal({ isOpen, closeModal, postId }) {
  const [reason, setReason] = useState("inappropriate");
  const REPORT_REASONS = [
    { value: "inappropriate", label: "부적절한 콘텐츠" },
    { value: "spam", label: "허위정보 및 스팸" },
    { value: "privacy", label: "개인정보 침해" },
    { value: "hate", label: "혐오 발언 및 차별" },
    { value: "fraud", label: "사기 및 부정행위" },
    { value: "copy", label: "저작권 및 지적재산권 침해" },
    { value: "etc", label: "기타 플랫폼 정책 위반" },
  ];

  const handleReport = async (reason, postId) => {
    try {
      const response = await fetchWithAuth("/api/report", {
        method: "POST",
        body: { postId: postId, reason: reason },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      alert("신고가 접수되었습니다.");
      closeModal();
    } catch (error) {
      alert(error.message);
    }
  };

  const buttonClick = () => {
    handleReport(reason, postId);
  };

  return (
    <CommonModal isOpen={isOpen} closeModal={closeModal}>
      <h2>신고하기</h2>
      <p>신고 사유를 선택해주세요.</p>
      <Select
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        options={REPORT_REASONS}
        placeholder="신고 사유 선택"
      />
      <Button onClick={buttonClick} highlight={true}>
        신고하기
      </Button>
    </CommonModal>
  );
}
