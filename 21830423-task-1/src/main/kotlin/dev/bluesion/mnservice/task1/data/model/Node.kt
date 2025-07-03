package dev.bluesion.mnservice.task1.data.model

/**
 * OSM(OpenStreetMap)에서 하나의 노드(위치 정보)를 나타내는 데이터 클래스입니다.
 *
 * @property id 노드의 고유 식별자
 * @property lat 위도(latitude)
 * @property lon 경도(longitude)
 */
data class Node(
    val id: Long,
    val lat: Double,
    val lon: Double
)