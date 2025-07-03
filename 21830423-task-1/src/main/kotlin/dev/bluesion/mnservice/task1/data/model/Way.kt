package dev.bluesion.mnservice.task1.data.model

/**
 * OSM(OpenStreetMap)에서 도로(또는 경로)를 나타내는 데이터 클래스입니다.
 *
 * @property id 도로(Way) id
 * @property nodes 도로를 구성하는 노드(Node) 목록
 * @property tags 도로에 대한 추가 정보(예: 도로명, 종류 등)를 담는 태그 맵
 */
data class Way(
    val id: Long,
    val nodes: MutableList<Node> = mutableListOf(),
    val tags: MutableMap<String, String> = mutableMapOf()
)