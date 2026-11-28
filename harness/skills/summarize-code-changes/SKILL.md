---
name: summarize-code-changes
description: Summarize the code changes made for a ForTunCloud task, including how behavior changed, all frontend and backend files, code review findings, verification, and deployment impact. Use for implementation completion reports and requests to explain what changed.
---

# 코드 변경 요약

현재 작업의 요청과 시작 시점의 변경 상태를 기준으로 수정 범위를 정한다. 구현 담당의 파일 목록, Git diff, 삭제 파일과 미추적 파일을 대조해 이번 작업의 변경분을 확인한다. 시작 시점부터 있던 수정과 이번 작업을 구분하기 어려운 파일은 확인 범위를 명시한다.

먼저 어떤 동작이 어떻게 바뀌었는지 두세 문장으로 설명한다. 이어서 프런트(`forjunView`)와 백엔드(`forjun`)의 변경 파일을 각 경로와 함께 빠짐없이 나열한다. 추가·수정·삭제를 표시하고 역할이 같은 파일은 묶어 짧게 설명한다. 작업에 포함된 테스트와 문서 등도 해당 영역 또는 기타 항목에 넣는다. 변경이 없는 영역은 한 줄로 표시한다.

QA 결과가 있으면 코드 리뷰에서 발견한 문제, 영향, 수정 또는 미해결 상태를 정리한다. 지적이 없는 경우에도 실제 검토한 영역을 적는다. 테스트 결과는 수행한 검사와 미실행·실패를 구분한다. API 추가·변경, 프런트·백엔드 재배포 필요 여부, 마이그레이션, 환경 변수 변경 등 실제 적용에 필요한 사항은 마지막에 명시한다.
