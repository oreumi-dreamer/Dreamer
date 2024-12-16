import Header from "@/components/header/Header";
import basicStyles from "../page.module.css";
import styles from "../privacy/page.module.css";
import Footer from "@/components/footer/Footer";
import { CustomScrollbar } from "@/components/Controls";

export default function Terms() {
  return (
    <main className={styles["main"]}>
      <h2>DREAMER 서비스 이용약관</h2>
      <h3>제1조 (목적)</h3>
      <p>
        본 약관은 DREAMER가 제공하는 꿈 기록 및 공유 서비스(이하
        &quot;서비스&quot;라 함)의 이용과 관련하여 팀 DREAMER와 회원의 권리,
        의무 및 책임사항을 규정함을 목적으로 합니다.
      </p>
      <h3>제2조 (정의)</h3>
      <ol>
        <li>
          &quot;서비스&quot;란 회원이 꿈을 기록하고 공유할 수 있는 SNS 플랫폼을
          의미합니다.
        </li>
        <li>
          &quot;회원&quot;이란 본 약관에 동의하고 팀 DREAMER와 서비스 이용계약을
          체결한 자를 말합니다.
        </li>
        <li>
          &quot;게시물&quot;이란 회원이 서비스에 게시한 모든 형태의 글, 사진,
          댓글 등을 의미합니다.
        </li>
      </ol>
      <h3>제3조 (약관의 효력 및 변경)</h3>
      <ol>
        <li>
          본 약관은 서비스 화면에 게시하거나 기타의 방법으로 회원에게
          공지함으로써 효력이 발생합니다.
        </li>
        <li>
          팀 DREAMER는 필요한 경우 본 약관을 변경할 수 있으며, 변경된 약관은
          공지사항을 통해 공지합니다.
        </li>
        <li>
          회원은 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단하고 탈퇴할
          수 있습니다.
        </li>
      </ol>
      <h3>제4조 (이용계약의 체결)</h3>
      <ol>
        <li>
          이용계약은 만 14세 이상의 개인이 본 약관에 동의하고 팀 DREAMER가
          제공하는 회원가입 양식에 따라 필요한 정보를 기입한 후, 팀 DREAMER가
          이를 승낙함으로써 체결됩니다.
        </li>
        <li>
          팀 DREAMER는 다음 각 호에 해당하는 경우 회원가입을 거절할 수 있습니다:
          <ul>
            <li>가입신청자가 만 14세 미만인 경우</li>
            <li>타인의 정보를 도용한 경우</li>
          </ul>
        </li>
      </ol>
      <h3>제5조 (개인정보의 보호)</h3>
      <ol>
        <li>
          팀 DREAMER는 서비스 제공을 위해 다음의 개인정보를 수집합니다:
          <ul>
            <li>이름</li>
            <li>아이디</li>
            <li>비밀번호</li>
            <li>생년월일</li>
            <li>이메일 주소</li>
          </ul>
        </li>
        <li>
          팀 DREAMER는 관련 법령에 따라 회원의 개인정보를 보호하며, 자세한
          내용은 개인정보 처리방침에서 정합니다.
        </li>
      </ol>
      <h3>제6조 (회원의 의무)</h3>
      <ol>
        <li>
          회원은 다음 각 호의 행위를 해서는 안 됩니다:
          <ul>
            <li>타인의 권리를 침해하거나 명예를 훼손하는 행위</li>
            <li>불법적이거나 사회적 질서에 반하는 내용의 게시물 작성</li>
            <li>영리를 목적으로 하는 무단 광고, 스팸 게시물 작성</li>
            <li>서비스의 안정적 운영을 방해하는 행위</li>
          </ul>
        </li>
        <li>
          회원은 관계 법령, 본 약관의 규정, 이용안내 및 서비스와 관련하여 공지한
          주의사항을 준수하여야 합니다.
        </li>
      </ol>
      <h3>제7조 (게시물의 관리)</h3>
      <ol>
        <li>
          회원이 서비스 내에 게시한 게시물의 저작권은 해당 회원에게 귀속됩니다.
        </li>
        <li>
          팀 DREAMER는 다음 각 호에 해당하는 게시물을 사전 통지 없이 삭제할 수
          있습니다:
          <ul>
            <li>타인의 권리를 침해하거나 명예를 훼손하는 내용</li>
            <li>불법적이거나 사회적 질서에 반하는 내용</li>
            <li>음란물 또는 청소년에게 유해한 내용</li>
            <li>영리목적의 광고성 내용</li>
          </ul>
        </li>
        <li>
          팀 DREAMER는 법령에 따라 관련 기관의 요청이 있는 경우 게시물을 제공할
          수 있습니다.
        </li>
      </ol>
      <h3>제8조 (서비스의 제공 및 중단)</h3>
      <ol>
        <li>
          팀 DREAMER는 설비의 보수점검, 교체 및 고장, 통신두절 또는 운영상
          상당한 이유가 있는 경우 서비스의 제공을 일시적으로 중단할 수 있습니다.
        </li>
        <li>
          팀 DREAMER는 서비스의 중단이 필요한 경우 사전에 공지하되, 불가피한
          경우에는 사후에 공지할 수 있습니다.
        </li>
      </ol>
      <h3>제9조 (이용계약의 해지)</h3>
      <ol>
        <li>
          회원은 언제든지 팀 DREAMER가 정한 절차에 따라 이용계약을 해지할 수
          있습니다.
        </li>
        <li>
          팀 DREAMER는 회원이 본 약관을 위반하거나 서비스의 정상적인 운영을
          방해한 경우 이용계약을 해지할 수 있습니다.
        </li>
      </ol>
      <h3>제10조 (면책조항)</h3>
      <ol>
        <li>
          팀 DREAMER는 천재지변, 전쟁, 기간통신사업자의 서비스 중지 등
          불가항력적인 사유로 인한 서비스 중단에 대해 책임을 지지 않습니다.
        </li>
        <li>
          팀 DREAMER는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을
          지지 않습니다.
        </li>
        <li>
          팀 DREAMER는 회원이 서비스를 이용하여 기대하는 수익을 상실한 것에
          대하여 책임을 지지 않으며, 그 밖의 서비스를 통하여 얻은 자료로 인한
          손해에 관하여 책임을 지지 않습니다.
        </li>
      </ol>
      <h3>제11조 (준거법 및 관할법원)</h3>
      <ol>
        <li>
          본 약관과 관련된 사항에 대하여는 대한민국 법률을 준거법으로 합니다.
        </li>
        <li>
          서비스 이용으로 발생한 분쟁에 대해 소송이 제기될 경우 대한민국 법원을
          관할 법원으로 합니다.
        </li>
      </ol>
      <h3>부칙 (시행일)</h3>
      <p>본 약관은 2024년 12월 16일부터 시행합니다.</p>
    </main>
  );
}
