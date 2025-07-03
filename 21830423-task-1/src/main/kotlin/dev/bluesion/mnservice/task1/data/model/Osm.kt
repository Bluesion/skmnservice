package dev.bluesion.mnservice.task1.data.model

/**
 * OSM(OpenStreetMap) 데이터를 표현하는 클래스입니다.
 *
 * @property nodes OSM에 포함된 노드(Node) 목록
 * @property ways OSM에 포함된 도로(Way) 목록
 */
data class Osm(
    val nodes: MutableList<Node> = mutableListOf(),
    val ways: MutableList<Way> = mutableListOf()
)